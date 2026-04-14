import { useEffect, useState } from 'react';
import { mockGeoPresenceConfig } from '../../mock/mockGeoPresenceConfig';
import { mockPresenceUsers } from '../../mock/mockPresenceUsers';
import type { GeoPresenceMode } from '../../core/config/geoPresenceConfig';
import type { PresenceUser } from '../../core/models/presenceUser';
import type { VisibilityFilter } from '../../core/models/visibilityFilter';
import type { MapSearchTarget } from '../../core/models/mapSearchTarget';
import {
    countMatchedUsers,
    countUsersByVisibility,
    filterUsersByVisibility,
} from '../../utils/presenceUserUtils';
import { searchPlaceByName, searchPlaceSuggestions } from '../../utils/geocodingUtils';
import SelectedUserDetails from '../../components/SelectedUserDetails';
import PresenceUserList from '../../components/PresenceUserList';
import GeoPresenceRendererPanel from '../../components/GeoPresenceRendererPanel';
import GeoPresenceControls from '../../components/GeoPresenceControls';
import GeoPresenceSummary from '../../components/GeoPresenceSummary';

function GeoPresenceDashboard() {
    const {
        mode: configuredMode = '2d',
        enableModeToggle = false,
        initialView,
        providers,
    } = mockGeoPresenceConfig;

    const [currentMode, setCurrentMode] = useState<GeoPresenceMode>(configuredMode);
    const [selectedUser, setSelectedUser] = useState<PresenceUser | null>(null);
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [placeSearchTerm, setPlaceSearchTerm] = useState('');
    const [placeSuggestions, setPlaceSuggestions] = useState<MapSearchTarget[]>([]);
    const [mapSearchTarget, setMapSearchTarget] = useState<MapSearchTarget | null>(null);
    const [isPlaceSearchLoading, setIsPlaceSearchLoading] = useState(false);
    const [placeSearchError, setPlaceSearchError] = useState<string | null>(null);
    const [placeSearchMessage, setPlaceSearchMessage] = useState<string | null>(null);
    const [showMatchedOnly, setShowMatchedOnly] = useState(false);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [autoScrollToSelectedUser, setAutoScrollToSelectedUser] = useState(true);

    const totalUserCount = mockPresenceUsers.length;
    const publicUserCount = countUsersByVisibility(mockPresenceUsers, 'public');
    const matchesOnlyUserCount = countUsersByVisibility(mockPresenceUsers, 'matches-only');
    const hiddenUserCount = countUsersByVisibility(mockPresenceUsers, 'hidden');
    const matchedUserCount = countMatchedUsers(mockPresenceUsers);

    const visibilityFilteredUsers = filterUsersByVisibility(mockPresenceUsers, visibilityFilter);

    const matchedFilteredUsers = showMatchedOnly
        ? visibilityFilteredUsers.filter((user) => user.isMatch)
        : visibilityFilteredUsers;

    const onlineFilteredUsers = showOnlineOnly
        ? matchedFilteredUsers.filter((user) => user.status === 'online')
        : matchedFilteredUsers;

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const filteredUsers = normalizedSearchTerm
        ? onlineFilteredUsers.filter((user) =>
            user.displayName.toLowerCase().includes(normalizedSearchTerm)
        )
        : onlineFilteredUsers;

    const initialLatitude = initialView?.lat ?? 39.5;
    const initialLongitude = initialView?.lon ?? -98.35;
    const initialZoom = initialView?.zoom ?? 3;
    const tileUrlTemplate = providers.map2d.tileUrlTemplate;
    const geocodingSearchUrl = providers.geocoding?.searchUrl;

    useEffect(() => {
        if (!selectedUser) {
            return;
        }

        const selectedUserStillVisible = filteredUsers.some((user) => user.id === selectedUser.id);

        if (!selectedUserStillVisible) {
            setSelectedUser(null);
        }
    }, [filteredUsers, selectedUser]);

    useEffect(() => {
        if (!geocodingSearchUrl) {
            return;
        }

        const trimmed = placeSearchTerm.trim();

        if (trimmed.length < 2) {
            setPlaceSuggestions([]);
            setPlaceSearchError(null);
            return;
        }

        const timeoutId = window.setTimeout(async () => {
            try {
                const suggestions = await searchPlaceSuggestions(geocodingSearchUrl, trimmed);
                setPlaceSuggestions(suggestions);
                setPlaceSearchError(null);
            } catch (error) {
                console.error('Place suggestion search failed', error);
                setPlaceSuggestions([]);
                setPlaceSearchError('Unable to load location suggestions right now.');
            }
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [placeSearchTerm, geocodingSearchUrl]);

    const handleModeToggle = () => {
        setCurrentMode((previousMode) => (previousMode === '2d' ? '3d' : '2d'));
    };

    const handleUserSelect = (user: PresenceUser) => {
        setSelectedUser(user);
        setMapSearchTarget(null);
        setPlaceSearchMessage(null);
    };

    const handleVisibilityFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setVisibilityFilter(event.target.value as VisibilityFilter);
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handlePlaceSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceSearchTerm(event.target.value);
        setPlaceSearchMessage(null);
        setPlaceSearchError(null);
    };

    const handleSubmitPlaceSearch = async () => {
        if (!geocodingSearchUrl) {
            setPlaceSearchError('Location search is not configured.');
            return;
        }

        try {
            setIsPlaceSearchLoading(true);
            setPlaceSearchError(null);
            setPlaceSearchMessage(null);

            const result = await searchPlaceByName(geocodingSearchUrl, placeSearchTerm);

            if (!result) {
                setMapSearchTarget(null);
                setPlaceSearchMessage('No matching location was found.');
                return;
            }

            setMapSearchTarget(result);
            setSelectedUser(null);
            setPlaceSuggestions([]);
            setPlaceSearchMessage(`Showing map results for ${result.label}`);
        } catch (error) {
            console.error('Place search failed', error);
            setPlaceSearchError('Location search failed. Please try again.');
        } finally {
            setIsPlaceSearchLoading(false);
        }
    };

    const handleClearPlaceSearch = () => {
        setPlaceSearchTerm('');
        setPlaceSuggestions([]);
        setMapSearchTarget(null);
        setPlaceSearchError(null);
        setPlaceSearchMessage(null);
    };

    const handleSelectPlaceSuggestion = (target: MapSearchTarget) => {
        setPlaceSearchTerm(target.label);
        setPlaceSuggestions([]);
        setMapSearchTarget(target);
        setSelectedUser(null);
        setPlaceSearchError(null);
        setPlaceSearchMessage(`Showing map results for ${target.label}`);
    };

    const handlePlaceSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            void handleSubmitPlaceSearch();
        }
    };

    const handleShowMatchedOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowMatchedOnly(event.target.checked);
    };

    const handleShowOnlineOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowOnlineOnly(event.target.checked);
    };

    const handleAutoScrollToSelectedUserChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAutoScrollToSelectedUser(event.target.checked);
    };

    return (
        <main className="app">
            <section className="app__header">
                <h1>geo-presence-mfe</h1>
                <p>Foundation setup in progress.</p>
            </section>

            <section className="app__main-content">
                <div className="app__renderer-column">
                    <GeoPresenceControls
                        currentMode={currentMode}
                        enableModeToggle={enableModeToggle}
                        visibilityFilter={visibilityFilter}
                        searchTerm={searchTerm}
                        placeSearchTerm={placeSearchTerm}
                        placeSuggestions={placeSuggestions}
                        placeSearchError={placeSearchError}
                        placeSearchMessage={placeSearchMessage}
                        showMatchedOnly={showMatchedOnly}
                        showOnlineOnly={showOnlineOnly}
                        autoScrollToSelectedUser={autoScrollToSelectedUser}
                        isPlaceSearchLoading={isPlaceSearchLoading}
                        onModeToggle={handleModeToggle}
                        onVisibilityFilterChange={handleVisibilityFilterChange}
                        onSearchTermChange={handleSearchTermChange}
                        onClearSearch={handleClearSearch}
                        onPlaceSearchTermChange={handlePlaceSearchTermChange}
                        onPlaceSearchKeyDown={handlePlaceSearchKeyDown}
                        onSubmitPlaceSearch={handleSubmitPlaceSearch}
                        onClearPlaceSearch={handleClearPlaceSearch}
                        onSelectPlaceSuggestion={handleSelectPlaceSuggestion}
                        onShowMatchedOnlyChange={handleShowMatchedOnlyChange}
                        onShowOnlineOnlyChange={handleShowOnlineOnlyChange}
                        onAutoScrollToSelectedUserChange={handleAutoScrollToSelectedUserChange}
                    />

                    <GeoPresenceRendererPanel
                        mode={currentMode}
                        users={filteredUsers}
                        selectedUser={selectedUser}
                        tileUrlTemplate={tileUrlTemplate}
                        initialLatitude={initialLatitude}
                        initialLongitude={initialLongitude}
                        initialZoom={initialZoom}
                        mapSearchTarget={mapSearchTarget}
                        onUserSelect={handleUserSelect}
                    />
                </div>

                <div className="app__details-column">
                    <GeoPresenceSummary
                        configuredMode={configuredMode}
                        currentMode={currentMode}
                        initialLatitude={initialLatitude}
                        initialLongitude={initialLongitude}
                        initialZoom={initialZoom}
                        totalUserCount={totalUserCount}
                        publicUserCount={publicUserCount}
                        matchesOnlyUserCount={matchesOnlyUserCount}
                        hiddenUserCount={hiddenUserCount}
                        matchedUserCount={matchedUserCount}
                        visibilityFilter={visibilityFilter}
                        filteredUserCount={filteredUsers.length}
                        selectedUserName={selectedUser?.displayName}
                        searchTerm={searchTerm}
                        activePlaceSearchLabel={mapSearchTarget?.label}
                        showMatchedOnly={showMatchedOnly}
                        showOnlineOnly={showOnlineOnly}
                        autoScrollToSelectedUser={autoScrollToSelectedUser}
                    />

                    <SelectedUserDetails selectedUser={selectedUser} />
                </div>
            </section>

            <PresenceUserList
                users={filteredUsers}
                selectedUser={selectedUser}
                onUserSelect={handleUserSelect}
                autoScrollToSelectedUser={autoScrollToSelectedUser}
            />
        </main>
    );
}

export default GeoPresenceDashboard;
