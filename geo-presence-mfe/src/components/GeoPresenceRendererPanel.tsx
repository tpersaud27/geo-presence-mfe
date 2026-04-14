import type { GeoPresenceMode } from '../core/config/geoPresenceConfig';
import type { PresenceUser } from '../core/models/presenceUser';
import type { MapSearchTarget } from '../core/models/mapSearchTarget';
import Map2DRenderer from './Map2DRenderer';
import Globe3DRenderer from './Globe3DRenderer';

interface GeoPresenceRendererPanelProps {
    mode: GeoPresenceMode;
    users: PresenceUser[];
    selectedUser: PresenceUser | null;
    tileUrlTemplate: string;
    initialLatitude: number;
    initialLongitude: number;
    initialZoom: number;
    mapSearchTarget: MapSearchTarget | null;
    onClearMapSearchTarget: () => void;
    onUserSelect: (user: PresenceUser) => void;
}

function GeoPresenceRendererPanel({
    mode,
    users,
    selectedUser,
    tileUrlTemplate,
    initialLatitude,
    initialLongitude,
    initialZoom,
    mapSearchTarget,
    onClearMapSearchTarget,
    onUserSelect,
}: GeoPresenceRendererPanelProps) {
    const is2DMode = mode === '2d';

    return (
        <section className="app__summary app__renderer-panel">
            <div className="app__renderer-header">
                <div>
                    <h2>{is2DMode ? '2D Map Renderer' : '3D Globe Renderer'}</h2>
                    <p>
                        <strong>Active Mode:</strong> {mode}
                    </p>
                    <p>
                        <strong>Users Ready to Render:</strong> {users.length}
                    </p>
                </div>
            </div>

            {mapSearchTarget && (
                <div className="app__active-map-search">
                    <div className="app__active-map-search-content">
                        <span className="app__active-map-search-label">Viewing location:</span>
                        <span className="app__active-map-search-value">{mapSearchTarget.label}</span>
                    </div>

                    <button
                        type="button"
                        className="app__control-button"
                        onClick={onClearMapSearchTarget}
                    >
                        Clear Location
                    </button>
                </div>
            )}

            <div className="app__renderer-surface">
                {is2DMode ? (
                    <Map2DRenderer
                        users={users}
                        selectedUser={selectedUser}
                        tileUrlTemplate={tileUrlTemplate}
                        initialLatitude={initialLatitude}
                        initialLongitude={initialLongitude}
                        initialZoom={initialZoom}
                        mapSearchTarget={mapSearchTarget}
                        onUserSelect={onUserSelect}
                    />
                ) : (
                    <Globe3DRenderer
                        initialLatitude={initialLatitude}
                        initialLongitude={initialLongitude}
                        initialZoom={initialZoom}
                        selectedUser={selectedUser}
                        mapSearchTarget={mapSearchTarget}
                    />
                )}
            </div>
        </section>
    );
}

export default GeoPresenceRendererPanel;
