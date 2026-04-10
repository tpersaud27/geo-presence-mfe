// This file should define:
// the display mode type
// the host-provided config interface

export type GeoPresenceMode = '2d' | '3d';

export interface GeoPresenceInitialView {
  lat: number;
  lon: number;
  zoom?: number;
}

export interface GeoPresenceMap2DProviderConfig {
  tileUrlTemplate: string;
  attribution?: string;
}

export interface GeoPresenceGlobe3DProviderConfig {
  imageryUrlTemplate: string;
  attribution?: string;
}

export interface GeoPresenceGeocodingProviderConfig {
  searchUrl: string;
  reverseUrl?: string;
}

export interface GeoPresenceProvidersConfig {
  map2d: GeoPresenceMap2DProviderConfig;
  globe3d: GeoPresenceGlobe3DProviderConfig;
  geocoding?: GeoPresenceGeocodingProviderConfig;
}

export interface GeoPresenceConfig {
  apiBaseUrl: string;
  getAccessToken: () => Promise<string>;

  mode?: GeoPresenceMode;
  enableModeToggle?: boolean;

  providers: GeoPresenceProvidersConfig;

  initialView?: GeoPresenceInitialView;
}
