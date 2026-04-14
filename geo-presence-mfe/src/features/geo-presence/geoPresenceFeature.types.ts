import type {
  GeoPresenceConfig,
  GeoPresenceMode,
} from "../../core/config/geoPresenceConfig";
import type { PresenceUser } from "../../core/models/presenceUser";
import type { MapSearchTarget } from "../../core/models/mapSearchTarget";

export interface GeoPresenceFeatureProps {
  config: GeoPresenceConfig;
  users: PresenceUser[];
  onUserSelected?: (user: PresenceUser) => void;
  onModeChanged?: (mode: GeoPresenceMode) => void;
  onLocationSearched?: (target: MapSearchTarget) => void;
}
