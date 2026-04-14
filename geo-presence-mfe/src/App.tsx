import "./App.css";
import GeoPresenceDashboard from "./features/geo-presence/GeoPresenceDashboard";
import { mockGeoPresenceConfig } from "./mock/mockGeoPresenceConfig";
import { mockPresenceUsers } from "./mock/mockPresenceUsers";

function App() {
  return (
    <GeoPresenceDashboard
      config={mockGeoPresenceConfig}
      users={mockPresenceUsers}
    />
  );
}

export default App;
