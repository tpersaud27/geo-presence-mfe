import type { PresenceUser } from '../core/models/presenceUser';

interface SelectedUserDetailsProps {
  selectedUser: PresenceUser | null;
}

function SelectedUserDetails({ selectedUser }: SelectedUserDetailsProps) {
  return (
    <section className="app__summary">
      <h2>Selected User Details</h2>

      {selectedUser ? (
        <div>
          <img
            src={selectedUser.avatarUrl}
            alt={selectedUser.displayName}
            className="app__avatar"
          />
          <p>
            <strong>Name:</strong> {selectedUser.displayName}
          </p>
          <p>
            <strong>ID:</strong> {selectedUser.id}
          </p>
          <p>
            <strong>Latitude:</strong> {selectedUser.coordinates.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {selectedUser.coordinates.lon}
          </p>
          <p>
            <strong>Visibility:</strong> {selectedUser.visibility}
          </p>
          <p>
            <strong>Matched:</strong> {selectedUser.isMatch ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Last Active:</strong> {selectedUser.lastActiveAt ?? 'Unknown'}
          </p>
        </div>
      ) : (
        <p>No user selected yet. Click a seeded user to preview their details.</p>
      )}
    </section>
  );
}

export default SelectedUserDetails;
