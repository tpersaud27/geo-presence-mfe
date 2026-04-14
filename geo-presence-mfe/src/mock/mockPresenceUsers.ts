import type { PresenceUser } from '../core/models/presenceUser';

export const mockPresenceUsers: PresenceUser[] = [
  {
    id: 'user-001',
    displayName: 'Ava',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    coordinates: {
      lat: 40.7128,
      lon: -74.006,
    },
    visibility: 'public',
    isMatch: true,
    status: 'online',
    lastActiveAt: '2026-04-10T12:00:00Z',
  },
  {
    id: 'user-002',
    displayName: 'Mia',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    coordinates: {
      lat: 34.0522,
      lon: -118.2437,
    },
    visibility: 'matches-only',
    isMatch: true,
    status: 'offline',
    lastActiveAt: '2026-04-10T11:30:00Z',
  },
  {
    id: 'user-003',
    displayName: 'Noah',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    coordinates: {
      lat: 41.8781,
      lon: -87.6298,
    },
    visibility: 'public',
    isMatch: false,
    status: 'online',
    lastActiveAt: '2026-04-10T10:15:00Z',
  },
  {
    id: 'user-004',
    displayName: 'Liam',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    coordinates: {
      lat: 29.7604,
      lon: -95.3698,
    },
    visibility: 'hidden',
    isMatch: false,
    status: 'offline',
    lastActiveAt: '2026-04-09T22:45:00Z',
  },
  {
    id: 'user-005',
    displayName: 'Sophia',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    coordinates: {
      lat: 47.6062,
      lon: -122.3321,
    },
    visibility: 'public',
    isMatch: true,
    status: 'online',
    lastActiveAt: '2026-04-10T09:50:00Z',
  },
];
