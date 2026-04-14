import { useEffect, useState } from 'react';
import { mockGeoPresenceConfig } from '../../mock/mockGeoPresenceConfig';
import { mockPresenceUsers } from '../../mock/mockPresenceUsers';
import type { GeoPresenceMode } from '../../core/config/geoPresenceConfig';
import type { PresenceUser } from '../../core/models/presenceUser';
import type { VisibilityFilter } from '../../core/models/visibilityFilter';
import {
    countMatchedUsers,
    countUsersByVisibility,
    filterUsersByVisibility,
} from '../../utils/presenceUserUtils';
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

    useEffect(() => {
        if (!selectedUser) {
            return;
        }

        const selectedUserStillVisible = filteredUsers.some((user) => user.id === selectedUser.id);

        if (!selectedUserStillVisible) {
            setSelectedUser(null);
        }
    }, [filteredUsers, selectedUser]);

    const handleModeToggle = () => {
        setCurrentMode((previousMode) => (previousMode === '2d' ? '3d' : '2d'));
    };

    const handleUserSelect = (user: PresenceUser) => {
        setSelectedUser(user);
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
                        showMatchedOnly={showMatchedOnly}
                        showOnlineOnly={showOnlineOnly}
                        autoScrollToSelectedUser={autoScrollToSelectedUser}
                        onModeToggle={handleModeToggle}
                        onVisibilityFilterChange={handleVisibilityFilterChange}
                        onSearchTermChange={handleSearchTermChange}
                        onClearSearch={handleClearSearch}
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
