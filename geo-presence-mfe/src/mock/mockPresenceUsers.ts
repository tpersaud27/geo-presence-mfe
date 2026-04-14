import type { PresenceUser } from '../core/models/presenceUser';

export const mockPresenceUsers: PresenceUser[] = [
  {
    id: 'user-001',
    displayName: 'Ava',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    coordinates: { lat: 40.7128, lon: -74.0060 }, // New York, NY
    visibility: 'public',
    isMatch: true,
    status: 'online',
    lastActiveAt: '2026-04-10T12:00:00Z',
  },
  {
    id: 'user-002',
    displayName: 'Mia',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    coordinates: { lat: 34.0522, lon: -118.2437 }, // Los Angeles, CA
    visibility: 'matches-only',
    isMatch: true,
    status: 'offline',
    lastActiveAt: '2026-04-10T11:30:00Z',
  },
  {
    id: 'user-003',
    displayName: 'Noah',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    coordinates: { lat: 41.8781, lon: -87.6298 }, // Chicago, IL
    visibility: 'public',
    isMatch: false,
    status: 'online',
    lastActiveAt: '2026-04-10T10:15:00Z',
  },
  {
    id: 'user-004',
    displayName: 'Liam',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    coordinates: { lat: 29.7604, lon: -95.3698 }, // Houston, TX
    visibility: 'hidden',
    isMatch: false,
    status: 'offline',
    lastActiveAt: '2026-04-09T22:45:00Z',
  },
  {
    id: 'user-005',
    displayName: 'Sophia',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    coordinates: { lat: 47.6062, lon: -122.3321 }, // Seattle, WA
    visibility: 'public',
    isMatch: true,
    status: 'online',
    lastActiveAt: '2026-04-10T09:50:00Z',
  },
  {
    id: 'user-006',
    displayName: 'Emma',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    coordinates: { lat: 25.7617, lon: -80.1918 }, // Miami, FL
    visibility: 'public',
    isMatch: false,
    status: 'online',
    lastActiveAt: '2026-04-10T08:40:00Z',
  },
  {
    id: 'user-007',
    displayName: 'Olivia',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    coordinates: { lat: 33.4484, lon: -112.0740 }, // Phoenix, AZ
    visibility: 'matches-only',
    isMatch: true,
    status: 'offline',
    lastActiveAt: '2026-04-10T07:25:00Z',
  },
  {
    id: 'user-008',
    displayName: 'Elijah',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    coordinates: { lat: 39.7392, lon: -104.9903 }, // Denver, CO
    visibility: 'public',
    isMatch: false,
    status: 'online',
    lastActiveAt: '2026-04-10T06:55:00Z',
  },
  {
    id: 'user-009',
    displayName: 'Charlotte',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    coordinates: { lat: 32.7767, lon: -96.7970 }, // Dallas, TX
    visibility: 'public',
    isMatch: true,
    status: 'offline',
    lastActiveAt: '2026-04-10T06:10:00Z',
  },
  {
    id: 'user-010',
    displayName: 'James',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
    coordinates: { lat: 37.7749, lon: -122.4194 }, // San Francisco, CA
    visibility: 'matches-only',
    isMatch: true,
    status: 'online',
    lastActiveAt: '2026-04-10T05:45:00Z',
  },
  {
    id: 'user-011',
    displayName: 'Amelia',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    coordinates: { lat: 38.9072, lon: -77.0369 }, // Washington, DC
    visibility: 'public',
    isMatch: false,
    status: 'online',
    lastActiveAt: '2026-04-10T05:10:00Z',
  },
  {
    id: 'user-012',
    displayName: 'Benjamin',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    coordinates: { lat: 42.3601, lon: -71.0589 }, // Boston, MA
    visibility: 'hidden',
    isMatch: false,
    status: 'offline',
    lastActiveAt: '2026-04-10T04:55:00Z',
  },
  {
    id: 'user-013',
    displayName: 'Harper',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    coordinates: { lat: 36.1627, lon: -86.7816 }, // Nashville, TN
    visibility: 'public',
    isMatch: true,
    status: 'online',
    lastActiveAt: '2026-04-10T04:20:00Z',
  },
  {
    id: 'user-014',
    displayName: 'Lucas',
    avatarUrl: 'https://i.pravatar.cc/150?img=14',
    coordinates: { lat: 44.9778, lon: -93.2650 }, // Minneapolis, MN
    visibility: 'matches-only',
    isMatch: false,
    status: 'offline',
    lastActiveAt: '2026-04-10T03:50:00Z',
  },
  {
    id: 'user-015',
    displayName: 'Evelyn',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    coordinates: { lat: 39.9526, lon: -75.1652 }, // Philadelphia, PA
    visibility: 'public',
    isMatch: true,
    status: 'online',
    lastActiveAt: '2026-04-10T03:10:00Z',
  },
  {
    id: 'user-016',
    displayName: 'Henry',
    avatarUrl: 'https://i.pravatar.cc/150?img=16',
    coordinates: { lat: 35.2271, lon: -80.8431 }, // Charlotte, NC
    visibility: 'public',
    isMatch: false,
    status: 'offline',
    lastActiveAt: '2026-04-10T02:45:00Z',
  },
  {
    id: 'user-017',
    displayName: 'Ella',
    avatarUrl: 'https://i.pravatar.cc/150?img=17',
    coordinates: { lat: 30.2672, lon: -97.7431 }, // Austin, TX
    visibility: 'matches-only',
    isMatch: true,
    status: 'online',
    lastActiveAt: '2026-04-10T02:15:00Z',
  },
  {
    id: 'user-018',
    displayName: 'Alexander',
    avatarUrl: 'https://i.pravatar.cc/150?img=18',
    coordinates: { lat: 36.1699, lon: -115.1398 }, // Las Vegas, NV
    visibility: 'public',
    isMatch: false,
    status: 'online',
    lastActiveAt: '2026-04-10T01:55:00Z',
  },
  {
    id: 'user-019',
    displayName: 'Grace',
    avatarUrl: 'https://i.pravatar.cc/150?img=19',
    coordinates: { lat: 45.5152, lon: -122.6784 }, // Portland, OR
    visibility: 'public',
    isMatch: true,
    status: 'offline',
    lastActiveAt: '2026-04-10T01:20:00Z',
  },
  {
    id: 'user-020',
    displayName: 'Daniel',
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
    coordinates: { lat: 33.7490, lon: -84.3880 }, // Atlanta, GA
    visibility: 'hidden',
    isMatch: false,
    status: 'online',
    lastActiveAt: '2026-04-10T00:50:00Z',
  },
];
