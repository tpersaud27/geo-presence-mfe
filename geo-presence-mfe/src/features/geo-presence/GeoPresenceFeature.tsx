import GeoPresenceDashboard from "./GeoPresenceDashboard";
import type { GeoPresenceFeatureProps } from "./geoPresenceFeature.types";

function GeoPresenceFeature(props: GeoPresenceFeatureProps) {
  return <GeoPresenceDashboard {...props} />;
}

export default GeoPresenceFeature;
