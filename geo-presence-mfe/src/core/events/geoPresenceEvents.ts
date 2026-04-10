import type { GeoPresenceMode } from '../config/geoPresenceConfig';

export interface GeoPresenceReadyEventDetail {
  version: string;
}

export interface GeoPresenceUserSelectedEventDetail {
  userId: string;
}

export interface GeoPresenceModeChangedEventDetail {
  mode: GeoPresenceMode;
}

export interface GeoPresenceErrorEventDetail {
  code: string;
  message: string;
}
