import type { GeoPresenceMode } from '../core/config/geoPresenceConfig';
import type { PresenceUser } from '../core/models/presenceUser';

interface GeoPresenceRendererPanelProps {
    mode: GeoPresenceMode;
    users: PresenceUser[];
}

function GeoPresenceRendererPanel({
    mode,
    users,
}: GeoPresenceRendererPanelProps) {
    const is2DMode = mode === '2d';

    return (
        <section className="app__summary">
            <h2>{is2DMode ? '2D Map Renderer' : '3D Globe Renderer'}</h2>

            <p>
                <strong>Active Mode:</strong> {mode}
            </p>

            <p>
                <strong>Users Ready to Render:</strong> {users.length}
            </p>

            {is2DMode ? (
                <div>
                    <p>MapLibre-based 2D renderer will be shown here.</p>
                    <p>This panel will eventually render map tiles, markers, and interactions.</p>
                </div>
            ) : (
                <div>
                    <p>Cesium-based 3D globe renderer will be shown here.</p>
                    <p>This panel will eventually render the globe, markers, and interactions.</p>
                </div>
            )}
        </section>
    );
}

export default GeoPresenceRendererPanel;
