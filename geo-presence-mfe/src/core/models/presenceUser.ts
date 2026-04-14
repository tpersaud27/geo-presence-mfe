export type PresenceVisibility = 'public' | 'matches-only' | 'hidden';
export type PresenceStatus = 'online' | 'offline';

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
  status: PresenceStatus;

  lastActiveAt?: string;
}
