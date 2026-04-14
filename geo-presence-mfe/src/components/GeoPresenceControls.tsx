import type { GeoPresenceMode } from '../core/config/geoPresenceConfig';
import type { VisibilityFilter } from '../core/models/visibilityFilter';

interface GeoPresenceControlsProps {
    currentMode: GeoPresenceMode;
    enableModeToggle: boolean;
    visibilityFilter: VisibilityFilter;
    searchTerm: string;
    placeSearchTerm: string;
    showMatchedOnly: boolean;
    showOnlineOnly: boolean;
    autoScrollToSelectedUser: boolean;
    isPlaceSearchLoading: boolean;
    onModeToggle: () => void;
    onVisibilityFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearSearch: () => void;
    onPlaceSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmitPlaceSearch: () => void;
    onClearPlaceSearch: () => void;
    onShowMatchedOnlyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onShowOnlineOnlyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAutoScrollToSelectedUserChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function GeoPresenceControls({
    currentMode,
    enableModeToggle,
    visibilityFilter,
    searchTerm,
    placeSearchTerm,
    showMatchedOnly,
    showOnlineOnly,
    autoScrollToSelectedUser,
    isPlaceSearchLoading,
    onModeToggle,
    onVisibilityFilterChange,
    onSearchTermChange,
    onClearSearch,
    onPlaceSearchTermChange,
    onSubmitPlaceSearch,
    onClearPlaceSearch,
    onShowMatchedOnlyChange,
    onShowOnlineOnlyChange,
    onAutoScrollToSelectedUserChange,
}: GeoPresenceControlsProps) {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasPlaceSearchTerm = placeSearchTerm.trim().length > 0;

    return (
        <section className="app__summary">
            <h2>Search & Filters</h2>

            {enableModeToggle && (
                <div style={{ marginBottom: '16px' }}>
                    <button type="button" onClick={onModeToggle}>
                        Switch to {currentMode === '2d' ? '3D' : '2D'} Mode
                    </button>
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="place-search">
                    <strong>Search Map by Location</strong>
                </label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <input
                        id="place-search"
                        type="text"
                        value={placeSearchTerm}
                        onChange={onPlaceSearchTermChange}
                        placeholder="Search city, state, or place"
                        style={{
                            flex: 1,
                            minWidth: '220px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                        }}
                    />
                    <button type="button" onClick={onSubmitPlaceSearch} disabled={isPlaceSearchLoading}>
                        {isPlaceSearchLoading ? 'Searching...' : 'Go'}
                    </button>
                    {hasPlaceSearchTerm && (
                        <button type="button" onClick={onClearPlaceSearch}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="name-search">
                    <strong>Search Users</strong>
                </label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input
                        id="name-search"
                        type="text"
                        value={searchTerm}
                        onChange={onSearchTermChange}
                        placeholder="Search by display name"
                        style={{
                            flex: 1,
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                        }}
                    />
                    {hasSearchTerm && (
                        <button type="button" onClick={onClearSearch}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <label htmlFor="visibility-filter">
                    <strong>Visibility</strong>
                </label>
                <select
                    id="visibility-filter"
                    value={visibilityFilter}
                    onChange={onVisibilityFilterChange}
                    style={{
                        display: 'block',
                        marginTop: '8px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                    }}
                >
                    <option value="all">All</option>
                    <option value="public">Public</option>
                    <option value="matches-only">Matches Only</option>
                    <option value="hidden">Hidden</option>
                </select>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
                <label htmlFor="matched-only-filter">
                    <input
                        id="matched-only-filter"
                        type="checkbox"
                        checked={showMatchedOnly}
                        onChange={onShowMatchedOnlyChange}
                    />{' '}
                    Show matched users only
                </label>

                <label htmlFor="online-only-filter">
                    <input
                        id="online-only-filter"
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={onShowOnlineOnlyChange}
                    />{' '}
                    Show online users only
                </label>

                <label htmlFor="auto-scroll-selected-user">
                    <input
                        id="auto-scroll-selected-user"
                        type="checkbox"
                        checked={autoScrollToSelectedUser}
                        onChange={onAutoScrollToSelectedUserChange}
                    />{' '}
                    Auto-scroll selected user into list view
                </label>
            </div>
        </section>
    );
}

export default GeoPresenceControls;
