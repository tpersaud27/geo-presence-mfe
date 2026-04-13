import type { PresenceUser } from '../core/models/presenceUser';

interface PresenceUserListProps {
    users: PresenceUser[];
    selectedUser: PresenceUser | null;
    onUserSelect: (user: PresenceUser) => void;
}

function PresenceUserList({
    users,
    selectedUser,
    onUserSelect,
}: PresenceUserListProps) {
    return (
        <section className="app__users">
            <h2>Seeded Presence Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="app__user-card">
                        <button
                            type="button"
                            onClick={() => onUserSelect(user)}
                            style={{
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-start',
                                width: '100%',
                                background: selectedUser?.id === user.id ? '#eef4ff' : 'transparent',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <img src={user.avatarUrl} alt={user.displayName} className="app__avatar" />
                            <div>
                                <p>
                                    <strong>{user.displayName}</strong>
                                </p>
                                <p>ID: {user.id}</p>
                                <p>
                                    Coordinates: {user.coordinates.lat}, {user.coordinates.lon}
                                </p>
                                <p>Visibility: {user.visibility}</p>
                                <p>Match: {user.isMatch ? 'Yes' : 'No'}</p>
                                <p>Last Active: {user.lastActiveAt ?? 'Unknown'}</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default PresenceUserList;
