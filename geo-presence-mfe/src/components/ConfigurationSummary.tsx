import type { GeoPresenceMode } from '../core/config/geoPresenceConfig';

type VisibilityFilter = 'all' | 'public' | 'matches-only' | 'hidden';

interface ConfigurationSummaryProps {
    configuredMode: GeoPresenceMode;
    currentMode: GeoPresenceMode;
    enableModeToggle: boolean;
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
    onModeToggle: () => void;
    onVisibilityFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function ConfigurationSummary({
    configuredMode,
    currentMode,
    enableModeToggle,
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
    onModeToggle,
    onVisibilityFilterChange,
}: ConfigurationSummaryProps) {
    return (
        <section className="app__summary">
            <h2>Configuration Summary</h2>
            <ul>
                <li>
                    <strong>Configured Mode:</strong> {configuredMode}
                </li>
                <li>
                    <strong>Current Mode:</strong> {currentMode}
                </li>
                <li>
                    <strong>Mode Toggle Enabled:</strong> {enableModeToggle ? 'Yes' : 'No'}
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
                    <strong>Filtered User Count:</strong> {filteredUserCount}
                </li>
                <li>
                    <strong>Selected User:</strong> {selectedUserName ?? 'None'}
                </li>
            </ul>

            {enableModeToggle && (
                <button type="button" onClick={onModeToggle}>
                    Switch to {currentMode === '2d' ? '3D' : '2D'} Mode
                </button>
            )}

            <div style={{ marginTop: '16px' }}>
                <label htmlFor="visibility-filter">
                    <strong>Visibility Filter: </strong>
                </label>
                <select
                    id="visibility-filter"
                    value={visibilityFilter}
                    onChange={onVisibilityFilterChange}
                >
                    <option value="all">All</option>
                    <option value="public">Public</option>
                    <option value="matches-only">Matches Only</option>
                    <option value="hidden">Hidden</option>
                </select>
            </div>
        </section>
    );
}

export default ConfigurationSummary;
