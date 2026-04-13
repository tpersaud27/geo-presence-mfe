import { useState } from 'react';
import './App.css';
import { mockGeoPresenceConfig } from './mock/mockGeoPresenceConfig';
import { mockPresenceUsers } from './mock/mockPresenceUsers';
import type { GeoPresenceMode } from './core/config/geoPresenceConfig';
import type { PresenceUser } from './core/models/presenceUser';
import {
  countMatchedUsers,
  countUsersByVisibility,
  filterUsersByVisibility,
} from './utils/presenceUserUtils';
import SelectedUserDetails from './components/SelectedUserDetails';
import ConfigurationSummary from './components/ConfigurationSummary';

type VisibilityFilter = 'all' | 'public' | 'matches-only' | 'hidden';

function App() {
  const {
    mode: configuredMode = '2d',
    enableModeToggle = false,
    initialView,
  } = mockGeoPresenceConfig;

  const [currentMode, setCurrentMode] = useState<GeoPresenceMode>(configuredMode);
  const [selectedUser, setSelectedUser] = useState<PresenceUser | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');

  const totalUserCount = mockPresenceUsers.length;
  const publicUserCount = countUsersByVisibility(mockPresenceUsers, 'public');
  const matchesOnlyUserCount = countUsersByVisibility(mockPresenceUsers, 'matches-only');
  const hiddenUserCount = countUsersByVisibility(mockPresenceUsers, 'hidden');
  const matchedUserCount = countMatchedUsers(mockPresenceUsers);

  const filteredUsers = filterUsersByVisibility(mockPresenceUsers, visibilityFilter);

  const handleModeToggle = () => {
    setCurrentMode((previousMode) => (previousMode === '2d' ? '3d' : '2d'));
  };

  const handleUserSelect = (user: PresenceUser) => {
    setSelectedUser(user);
  };

  const handleVisibilityFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVisibilityFilter(event.target.value as VisibilityFilter);
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
        initialLatitude={initialView?.lat}
        initialLongitude={initialView?.lon}
        initialZoom={initialView?.zoom}
        totalUserCount={totalUserCount}
        publicUserCount={publicUserCount}
        matchesOnlyUserCount={matchesOnlyUserCount}
        hiddenUserCount={hiddenUserCount}
        matchedUserCount={matchedUserCount}
        visibilityFilter={visibilityFilter}
        filteredUserCount={filteredUsers.length}
        selectedUserName={selectedUser?.displayName}
        onModeToggle={handleModeToggle}
        onVisibilityFilterChange={handleVisibilityFilterChange}
      />

      <SelectedUserDetails selectedUser={selectedUser} />

      <section className="app__users">
        <h2>Seeded Presence Users</h2>
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id} className="app__user-card">
              <button
                type="button"
                onClick={() => handleUserSelect(user)}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  width: '100%',
                  background: selectedUser?.id === user.id ? '#eef4ff' : 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <img src={user.avatarUrl} alt={user.displayName} className="app__avatar" />
                <div>
                  <p>
                    <strong>{user.displayName}</strong>
                  </p>
                  <p>ID: {user.id}</p>
                  <p>
                    Coordinates: {user.coordinates.lat}, {user.coordinates.lon}
                  </p>
                  <p>Visibility: {user.visibility}</p>
                  <p>Match: {user.isMatch ? 'Yes' : 'No'}</p>
                  <p>Last Active: {user.lastActiveAt ?? 'Unknown'}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
