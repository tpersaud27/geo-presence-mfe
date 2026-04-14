import { useEffect, useRef } from 'react';
import type { PresenceUser } from '../core/models/presenceUser';

interface PresenceUserListProps {
    users: PresenceUser[];
    selectedUser: PresenceUser | null;
    onUserSelect: (user: PresenceUser) => void;
    autoScrollToSelectedUser: boolean;
}

function PresenceUserList({
    users,
    selectedUser,
    onUserSelect,
    autoScrollToSelectedUser,
}: PresenceUserListProps) {
    const userItemRefs = useRef<Record<string, HTMLLIElement | null>>({});

    useEffect(() => {
        if (!autoScrollToSelectedUser || !selectedUser) {
            return;
        }

        const selectedElement = userItemRefs.current[selectedUser.id];

        if (selectedElement) {
            selectedElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [selectedUser, autoScrollToSelectedUser]);

    return (
        <section className="app__users">
            <h2>Seeded Presence Users</h2>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="app__user-card"
                        ref={(element) => {
                            userItemRefs.current[user.id] = element;
                        }}
                    >
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
                                <p>Status: {user.status}</p>
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
