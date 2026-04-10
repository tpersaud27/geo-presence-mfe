// This file should define:
// visibility options
// coordinates model
// user/presence data shape

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
