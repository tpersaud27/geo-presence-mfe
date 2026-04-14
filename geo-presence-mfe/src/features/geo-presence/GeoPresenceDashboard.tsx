import { useState } from 'react';
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
import ConfigurationSummary from '../../components/ConfigurationSummary';
import PresenceUserList from '../../components/PresenceUserList';
import GeoPresenceRendererPanel from '../../components/GeoPresenceRendererPanel';

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
    const [showMatchedOnly, setShowMatchedOnly] = useState(false);
    const [autoScrollToSelectedUser, setAutoScrollToSelectedUser] = useState(true);

    const totalUserCount = mockPresenceUsers.length;
    const publicUserCount = countUsersByVisibility(mockPresenceUsers, 'public');
    const matchesOnlyUserCount = countUsersByVisibility(mockPresenceUsers, 'matches-only');
    const hiddenUserCount = countUsersByVisibility(mockPresenceUsers, 'hidden');
    const matchedUserCount = countMatchedUsers(mockPresenceUsers);

    const visibilityFilteredUsers = filterUsersByVisibility(mockPresenceUsers, visibilityFilter);

    const filteredUsers = showMatchedOnly
        ? visibilityFilteredUsers.filter((user) => user.isMatch)
        : visibilityFilteredUsers;

    const initialLatitude = initialView?.lat ?? 39.5;
    const initialLongitude = initialView?.lon ?? -98.35;
    const initialZoom = initialView?.zoom ?? 3;
    const tileUrlTemplate = providers.map2d.tileUrlTemplate;

    const handleModeToggle = () => {
        setCurrentMode((previousMode) => (previousMode === '2d' ? '3d' : '2d'));
    };

    const handleUserSelect = (user: PresenceUser) => {
        setSelectedUser(user);
    };

    const handleVisibilityFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setVisibilityFilter(event.target.value as VisibilityFilter);
    };

    const handleShowMatchedOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowMatchedOnly(event.target.checked);
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

            <ConfigurationSummary
                configuredMode={configuredMode}
                currentMode={currentMode}
                enableModeToggle={enableModeToggle}
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
                showMatchedOnly={showMatchedOnly}
                autoScrollToSelectedUser={autoScrollToSelectedUser}
                onModeToggle={handleModeToggle}
                onVisibilityFilterChange={handleVisibilityFilterChange}
                onShowMatchedOnlyChange={handleShowMatchedOnlyChange}
                onAutoScrollToSelectedUserChange={handleAutoScrollToSelectedUserChange}
            />

            <section className="app__main-content">
                <div className="app__renderer-column">
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
