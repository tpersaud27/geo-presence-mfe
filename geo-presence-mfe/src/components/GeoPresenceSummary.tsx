import type { GeoPresenceMode } from '../core/config/geoPresenceConfig';
import type { VisibilityFilter } from '../core/models/visibilityFilter';

interface GeoPresenceSummaryProps {
    configuredMode: GeoPresenceMode;
    currentMode: GeoPresenceMode;
    initialLatitude?: number;
    initialLongitude?: number;
    initialZoom?: number;
    totalUserCount: number;
    publicUserCount: number;
    matchesOnlyUserCount: number;
    hiddenUserCount: number;
    matchedUserCount: number;
    visibilityFilter: VisibilityFilter;
    filteredUserCount: number;
    selectedUserName?: string;
    searchTerm: string;
    showMatchedOnly: boolean;
    showOnlineOnly: boolean;
    autoScrollToSelectedUser: boolean;
}

function GeoPresenceSummary({
    configuredMode,
    currentMode,
    initialLatitude,
    initialLongitude,
    initialZoom,
    totalUserCount,
    publicUserCount,
    matchesOnlyUserCount,
    hiddenUserCount,
    matchedUserCount,
    visibilityFilter,
    filteredUserCount,
    selectedUserName,
    searchTerm,
    showMatchedOnly,
    showOnlineOnly,
    autoScrollToSelectedUser,
}: GeoPresenceSummaryProps) {
    const hasSearchTerm = searchTerm.trim().length > 0;

    return (
        <section className="app__summary">
            <h2>Summary</h2>
            <ul>
                <li>
                    <strong>Configured Mode:</strong> {configuredMode}
                </li>
                <li>
                    <strong>Current Mode:</strong> {currentMode}
                </li>
                <li>
                    <strong>Initial Latitude:</strong> {initialLatitude ?? 'Not set'}
                </li>
                <li>
                    <strong>Initial Longitude:</strong> {initialLongitude ?? 'Not set'}
                </li>
                <li>
                    <strong>Initial Zoom:</strong> {initialZoom ?? 'Not set'}
                </li>
                <li>
                    <strong>Total Users:</strong> {totalUserCount}
                </li>
                <li>
                    <strong>Public Users:</strong> {publicUserCount}
                </li>
                <li>
                    <strong>Matches-Only Users:</strong> {matchesOnlyUserCount}
                </li>
                <li>
                    <strong>Hidden Users:</strong> {hiddenUserCount}
                </li>
                <li>
                    <strong>Matched Users:</strong> {matchedUserCount}
                </li>
                <li>
                    <strong>Active Visibility Filter:</strong> {visibilityFilter}
                </li>
                <li>
                    <strong>Active Search Term:</strong> {hasSearchTerm ? searchTerm : 'None'}
                </li>
                <li>
                    <strong>Matched-Only Filter Enabled:</strong> {showMatchedOnly ? 'Yes' : 'No'}
                </li>
                <li>
                    <strong>Online-Only Filter Enabled:</strong> {showOnlineOnly ? 'Yes' : 'No'}
                </li>
                <li>
                    <strong>Auto-Scroll Selected User:</strong> {autoScrollToSelectedUser ? 'Yes' : 'No'}
                </li>
                <li>
                    <strong>Filtered User Count:</strong> {filteredUserCount}
                </li>
                <li>
                    <strong>Selected User:</strong> {selectedUserName ?? 'None'}
                </li>
            </ul>
        </section>
    );
}

export default GeoPresenceSummary;
