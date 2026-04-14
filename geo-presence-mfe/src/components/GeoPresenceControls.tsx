import type { GeoPresenceMode } from '../core/config/geoPresenceConfig';
import type { VisibilityFilter } from '../core/models/visibilityFilter';
import type { MapSearchTarget } from '../core/models/mapSearchTarget';

interface GeoPresenceControlsProps {
    currentMode: GeoPresenceMode;
    enableModeToggle: boolean;
    visibilityFilter: VisibilityFilter;
    searchTerm: string;
    placeSearchTerm: string;
    placeSuggestions: MapSearchTarget[];
    placeSearchError: string | null;
    placeSearchMessage: string | null;
    showMatchedOnly: boolean;
    showOnlineOnly: boolean;
    autoScrollToSelectedUser: boolean;
    isPlaceSearchLoading: boolean;
    onModeToggle: () => void;
    onVisibilityFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearSearch: () => void;
    onPlaceSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPlaceSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onSubmitPlaceSearch: () => void;
    onClearPlaceSearch: () => void;
    onSelectPlaceSuggestion: (target: MapSearchTarget) => void;
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
    placeSuggestions,
    placeSearchError,
    placeSearchMessage,
    showMatchedOnly,
    showOnlineOnly,
    autoScrollToSelectedUser,
    isPlaceSearchLoading,
    onModeToggle,
    onVisibilityFilterChange,
    onSearchTermChange,
    onClearSearch,
    onPlaceSearchTermChange,
    onPlaceSearchKeyDown,
    onSubmitPlaceSearch,
    onClearPlaceSearch,
    onSelectPlaceSuggestion,
    onShowMatchedOnlyChange,
    onShowOnlineOnlyChange,
    onAutoScrollToSelectedUserChange,
}: GeoPresenceControlsProps) {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasPlaceSearchTerm = placeSearchTerm.trim().length > 0;

    return (
        <section className="app__summary">
            <h2>Search & Filters</h2>

            <div className="app__controls-section">
                {enableModeToggle && (
                    <div className="app__control-group">
                        <button type="button" className="app__control-button" onClick={onModeToggle}>
                            Switch to {currentMode === '2d' ? '3D' : '2D'} Mode
                        </button>
                    </div>
                )}

                <div className="app__control-group">
                    <label htmlFor="place-search" className="app__control-label">
                        Search Map by Location
                    </label>

                    <div className="app__control-row">
                        <input
                            id="place-search"
                            type="text"
                            value={placeSearchTerm}
                            onChange={onPlaceSearchTermChange}
                            onKeyDown={onPlaceSearchKeyDown}
                            placeholder="Search city, state, or place"
                            className="app__control-input"
                        />

                        <button
                            type="button"
                            className="app__control-button"
                            onClick={onSubmitPlaceSearch}
                            disabled={isPlaceSearchLoading}
                        >
                            {isPlaceSearchLoading ? 'Searching...' : 'Go'}
                        </button>

                        {hasPlaceSearchTerm && (
                            <button
                                type="button"
                                className="app__control-button"
                                onClick={onClearPlaceSearch}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {placeSuggestions.length > 0 && (
                        <div className="app__suggestions">
                            {placeSuggestions.map((suggestion) => (
                                <button
                                    key={`${suggestion.label}-${suggestion.lat}-${suggestion.lon}`}
                                    type="button"
                                    className="app__suggestion-button"
                                    onClick={() => onSelectPlaceSuggestion(suggestion)}
                                >
                                    {suggestion.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {placeSearchMessage && <p className="app__helper-text">{placeSearchMessage}</p>}

                    {placeSearchError && <p className="app__error-text">{placeSearchError}</p>}
                </div>

                <div className="app__control-group">
                    <label htmlFor="name-search" className="app__control-label">
                        Search Users
                    </label>

                    <div className="app__control-row">
                        <input
                            id="name-search"
                            type="text"
                            value={searchTerm}
                            onChange={onSearchTermChange}
                            placeholder="Search by display name"
                            className="app__control-input"
                        />

                        {hasSearchTerm && (
                            <button type="button" className="app__control-button" onClick={onClearSearch}>
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="app__control-group">
                    <label htmlFor="visibility-filter" className="app__control-label">
                        Visibility
                    </label>

                    <select
                        id="visibility-filter"
                        value={visibilityFilter}
                        onChange={onVisibilityFilterChange}
                        className="app__control-select"
                    >
                        <option value="all">All</option>
                        <option value="public">Public</option>
                        <option value="matches-only">Matches Only</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </div>

                <div className="app__checkbox-group">
                    <label htmlFor="matched-only-filter" className="app__checkbox-label">
                        <input
                            id="matched-only-filter"
                            type="checkbox"
                            checked={showMatchedOnly}
                            onChange={onShowMatchedOnlyChange}
                        />{' '}
                        Show matched users only
                    </label>

                    <label htmlFor="online-only-filter" className="app__checkbox-label">
                        <input
                            id="online-only-filter"
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={onShowOnlineOnlyChange}
                        />{' '}
                        Show online users only
                    </label>

                    <label htmlFor="auto-scroll-selected-user" className="app__checkbox-label">
                        <input
                            id="auto-scroll-selected-user"
                            type="checkbox"
                            checked={autoScrollToSelectedUser}
                            onChange={onAutoScrollToSelectedUserChange}
                        />{' '}
                        Auto-scroll selected user into list view
                    </label>
                </div>
            </div>
        </section>
    );
}

export default GeoPresenceControls;
