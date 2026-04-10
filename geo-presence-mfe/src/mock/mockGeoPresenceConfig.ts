import type { GeoPresenceConfig } from '../core/config/geoPresenceConfig';

// This mock file acts like:
// --> a pretend host
// --> a development-time config source
// --> a way to test your types and rendering

export const mockGeoPresenceConfig: GeoPresenceConfig = {
  apiBaseUrl: 'https://api.example.com',
  getAccessToken: async () => 'mock-access-token',

  mode: '2d',
  enableModeToggle: true,

  providers: {
    map2d: {
      tileUrlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
    },
    globe3d: {
      imageryUrlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
    },
    geocoding: {
      searchUrl: 'https://nominatim.openstreetmap.org/search',
      reverseUrl: 'https://nominatim.openstreetmap.org/reverse',
    },
  },

  // This gives us something visible and testable in the UI.
  // The values here roughly center on the continental U.S. (default for early testing)
  initialView: {
    lat: 39.5,
    lon: -98.35,
    zoom: 3,
  },
};
