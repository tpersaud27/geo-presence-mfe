import "./App.css";
import GeoPresenceDashboard from "./features/geo-presence/GeoPresenceDashboard";
import { mockGeoPresenceConfig } from "./mock/mockGeoPresenceConfig";
import { mockPresenceUsers } from "./mock/mockPresenceUsers";
import type { GeoPresenceMode } from "./core/config/geoPresenceConfig";
import type { PresenceUser } from "./core/models/presenceUser";
import type { MapSearchTarget } from "./core/models/mapSearchTarget";

function App() {
  const handleUserSelected = (user: PresenceUser) => {
    console.log("Host received selected user:", user.displayName);
  };

  const handleModeChanged = (mode: GeoPresenceMode) => {
    console.log("Host received mode change:", mode);
  };

  const handleLocationSearched = (target: MapSearchTarget) => {
    console.log("Host received location search:", target.label);
  };

  return (
    <GeoPresenceDashboard
      config={mockGeoPresenceConfig}
      users={mockPresenceUsers}
      onUserSelected={handleUserSelected}
      onModeChanged={handleModeChanged}
      onLocationSearched={handleLocationSearched}
    />
  );
}

export default App;
