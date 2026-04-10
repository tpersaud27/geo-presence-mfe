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

      <section className="app__summary">
        <h2>Configuration Summary</h2>
        <ul>
          <li>
            <strong>Configured Mode:</strong> {configuredMode}
          </li>
          <li>
            <strong>Current Mode:</strong> {currentMode}
          </li>
          <li>
            <strong>Mode Toggle Enabled:</strong> {enableModeToggle ? 'Yes' : 'No'}
          </li>
          <li>
            <strong>Initial Latitude:</strong> {initialView?.lat ?? 'Not set'}
          </li>
          <li>
            <strong>Initial Longitude:</strong> {initialView?.lon ?? 'Not set'}
          </li>
          <li>
            <strong>Initial Zoom:</strong> {initialView?.zoom ?? 'Not set'}
          </li>
          <li>
            <strong>Total Users:</strong> {totalUserCount}
          </li>
          <li>
            <strong>Public Users:</strong> {publicUserCount}
          </li>
          <li>
            <strong>Matches-Only Users:</strong> {matchesOnlyUserCount}
          </li>
          <li>
            <strong>Hidden Users:</strong> {hiddenUserCount}
          </li>
          <li>
            <strong>Matched Users:</strong> {matchedUserCount}
          </li>
          <li>
            <strong>Active Visibility Filter:</strong> {visibilityFilter}
          </li>
          <li>
            <strong>Filtered User Count:</strong> {filteredUsers.length}
          </li>
          <li>
            <strong>Selected User:</strong> {selectedUser?.displayName ?? 'None'}
          </li>
        </ul>

        {enableModeToggle && (
          <button type="button" onClick={handleModeToggle}>
            Switch to {currentMode === '2d' ? '3D' : '2D'} Mode
          </button>
        )}

        <div style={{ marginTop: '16px' }}>
          <label htmlFor="visibility-filter">
            <strong>Visibility Filter: </strong>
          </label>
          <select
            id="visibility-filter"
            value={visibilityFilter}
            onChange={handleVisibilityFilterChange}
          >
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="matches-only">Matches Only</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </section>

      <section className="app__summary">
        <h2>Selected User Details</h2>

        {selectedUser ? (
          <div>
            <img
              src={selectedUser.avatarUrl}
              alt={selectedUser.displayName}
              className="app__avatar"
            />
            <p>
              <strong>Name:</strong> {selectedUser.displayName}
            </p>
            <p>
              <strong>ID:</strong> {selectedUser.id}
            </p>
            <p>
              <strong>Latitude:</strong> {selectedUser.coordinates.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {selectedUser.coordinates.lon}
            </p>
            <p>
              <strong>Visibility:</strong> {selectedUser.visibility}
            </p>
            <p>
              <strong>Matched:</strong> {selectedUser.isMatch ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Last Active:</strong> {selectedUser.lastActiveAt ?? 'Unknown'}
            </p>
          </div>
        ) : (
          <p>No user selected yet. Click a seeded user to preview their details.</p>
        )}
      </section>

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
