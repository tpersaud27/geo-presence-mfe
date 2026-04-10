import './App.css';
import { mockGeoPresenceConfig } from './mock/mockGeoPresenceConfig';
import { mockPresenceUsers } from './mock/mockPresenceUsers';

function App() {
  const { mode = '2d', enableModeToggle = false, initialView } = mockGeoPresenceConfig;

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
            <strong>Mode:</strong> {mode}
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
            <strong>Mock Users:</strong> {mockPresenceUsers.length}
          </li>
        </ul>
      </section>

      <section className="app__users">
        <h2>Seeded Presence Users</h2>
        <ul>
          {mockPresenceUsers.map((user) => (
            <li key={user.id} className="app__user-card">
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
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
