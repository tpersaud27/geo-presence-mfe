# geo-presence-mfe

Reusable React-based microfrontend for displaying location presence in 2D maps and 3D globes.

## Phase 1 Starter Contract

This project is being built as a reusable microfrontend with a lightweight, host-driven integration model. Before implementation, this starter contract defines the initial responsibilities, configuration, events, and mock data model.

---

## Purpose

`geo-presence-mfe` is intended to:

- render a map or globe UI
- support switching between 2D and 3D modes
- display visible people/markers by location
- provide search and filter UI
- remain reusable across different host applications
- rely on the host for authentication and navigation

---

## Responsibility Split

### `geo-presence-mfe` responsibilities

The microfrontend is responsible for:

- rendering the map or globe UI
- allowing the user to switch between 2D and 3D
- rendering visible people markers
- showing search and filter controls
- managing local UI state such as:
  - selected marker
  - current mode
  - current filters
- calling backend endpoints using host-provided configuration
- emitting events back to the host when important actions happen

### Host application responsibilities

The host application is responsible for:

- authentication
- deciding what access token to provide
- navigation to profile/detail pages
- determining what backend endpoints to use
- supplying provider URLs for:
  - 2D map tiles
  - 3D globe imagery
  - geocoding
- enforcing privacy and visibility rules on the backend
- optionally storing user preferences such as last selected mode

---

## Why this split matters

This separation keeps the microfrontend reusable.

If the microfrontend starts owning login, routing, or profile-page behavior, it becomes tied to one application. Keeping these concerns in the host makes `geo-presence-mfe` portable across Angular, React, and other environments.

---

## Initial Config Contract

This is the initial configuration the host will pass to the microfrontend.

```typescript
export type GeoPresenceMode = '2d' | '3d';

export interface GeoPresenceConfig {
  apiBaseUrl: string;
  getAccessToken: () => Promise<string>;

  mode?: GeoPresenceMode;
  enableModeToggle?: boolean;

  providers: {
    map2d: {
      tileUrlTemplate: string;
      attribution?: string;
    };
    globe3d: {
      imageryUrlTemplate: string;
      attribution?: string;
    };
    geocoding?: {
      searchUrl: string;
      reverseUrl?: string;
    };
  };

  initialView?: {
    lat: number;
    lon: number;
    zoom?: number;
  };
}
```

### Field explanations

#### `apiBaseUrl`
The backend base URL used for API requests.

Why needed:
- avoids hardcoded backend URLs
- supports reuse across environments and host apps

#### `getAccessToken`
A callback supplied by the host that returns an access token.

Why needed:
- the host owns authentication
- tokens may need refresh
- the microfrontend should not assume where tokens are stored

#### `mode`
The initial rendering mode.

Allowed values:
- `'2d'`
- `'3d'`

Why needed:
- the host may want to restore the user's preferred view

#### `enableModeToggle`
Controls whether the built-in mode toggle is shown.

Why needed:
- some hosts may want the component to show its own toggle
- other hosts may control mode externally

#### `providers`
Contains external provider configuration.

Why needed:
- keeps the microfrontend provider-neutral
- avoids hardcoding tile or geocoding services

#### `providers.map2d.tileUrlTemplate`
Tile URL template for the 2D map renderer.

#### `providers.map2d.attribution`
Optional attribution text for the tile provider.

#### `providers.globe3d.imageryUrlTemplate`
Imagery URL template for the 3D globe renderer.

#### `providers.globe3d.attribution`
Optional attribution text for the globe imagery provider.

#### `providers.geocoding`
Optional geocoding configuration.

Why optional:
- some hosts may not enable search immediately

#### `providers.geocoding.searchUrl`
Endpoint used to search for places.

#### `providers.geocoding.reverseUrl`
Optional endpoint used for reverse geocoding.

#### `initialView`
Optional starting view for the map/globe.

Why needed:
- lets hosts set a meaningful initial region
- useful for demo environments and seeded data

---

## Initial Event Contract

The microfrontend communicates back to the host through events.

```typescript
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
```

### Initial events

- `ready`
- `userSelected`
- `modeChanged`
- `error`

### Event explanations

#### `ready`
Emitted when the component is initialized and usable.

Why needed:
- helps hosts know the component loaded correctly
- useful for telemetry and debugging

#### `userSelected`
Emitted when a person marker or list item is selected.

Why needed:
- host-owned navigation is best practice
- the host decides whether to route, open a drawer, or show a modal

#### `modeChanged`
Emitted when the user switches between 2D and 3D.

Why needed:
- the host may want to persist the preference
- useful for analytics and state synchronization

#### `error`
Emitted when the component encounters a problem.

Why needed:
- the host may want to display or log errors
- useful for API issues, provider failures, or config problems

---

## Initial User / Location Model

This is the initial mock data shape for visible users.

```typescript
export type PresenceVisibility = 'public' | 'matches-only' | 'hidden';

export interface PresenceCoordinates {
  lat: number;
  lon: number;
}

export interface PresenceUser {
  id: string;
  displayName: string;
  avatarUrl?: string;

  coordinates: PresenceCoordinates;

  visibility: PresenceVisibility;
  isMatch: boolean;

  lastActiveAt?: string;
}
```

### Field explanations

#### `id`
Unique identifier for the user.

Why needed:
- selection tracking
- rendering lists
- event payloads
- future API usage

#### `displayName`
A human-readable name for the user.

Why needed:
- marker labels
- preview cards
- list views

#### `avatarUrl`
Optional image URL for the user.

Why optional:
- not every mock user needs an image
- keeps the model flexible

#### `coordinates`
Latitude and longitude grouped into one object.

Why needed:
- models location clearly
- easier to extend later with more location metadata

#### `visibility`
Indicates how the user should be treated for visibility.

Allowed values:
- `'public'`
- `'matches-only'`
- `'hidden'`

Why needed:
- helps prototype privacy rules early
- supports mock filtering scenarios

#### `isMatch`
Whether the current viewer is matched with this user.

Why needed:
- supports mutually-liked / matched filtering behavior
- useful for seeded learning data

#### `lastActiveAt`
Optional timestamp of last activity.

Why useful:
- supports future filtering and UI display
- not required in the first build
