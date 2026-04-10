import type { PresenceUser, PresenceVisibility } from '../core/models/presenceUser';

export function countUsersByVisibility(
  users: PresenceUser[],
  visibility: PresenceVisibility
): number {
  return users.filter((user) => user.visibility === visibility).length;
}

export function countMatchedUsers(users: PresenceUser[]): number {
  return users.filter((user) => user.isMatch).length;
}

export function filterUsersByVisibility(
  users: PresenceUser[],
  visibilityFilter: 'all' | PresenceVisibility
): PresenceUser[] {
  if (visibilityFilter === 'all') {
    return users;
  }

  return users.filter((user) => user.visibility === visibilityFilter);
}
