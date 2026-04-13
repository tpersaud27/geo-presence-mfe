import type { GeoPresenceMode } from '../core/config/geoPresenceConfig';
import type { PresenceUser } from '../core/models/presenceUser';
import Map2DRenderer from './Map2DRenderer';
import { mockGeoPresenceConfig } from '../mock/mockGeoPresenceConfig';

interface GeoPresenceRendererPanelProps {
    mode: GeoPresenceMode;
    users: PresenceUser[];
}

function GeoPresenceRendererPanel({
    mode,
    users,
}: GeoPresenceRendererPanelProps) {
    const is2DMode = mode === '2d';
    const initialLatitude = mockGeoPresenceConfig.initialView?.lat ?? 39.5;
    const initialLongitude = mockGeoPresenceConfig.initialView?.lon ?? -98.35;
    const initialZoom = mockGeoPresenceConfig.initialView?.zoom ?? 3;
    const tileUrlTemplate =
        mockGeoPresenceConfig.providers.map2d.tileUrlTemplate;

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

            <div className="app__renderer-surface">
                {is2DMode ? (
                    <Map2DRenderer
                        tileUrlTemplate={tileUrlTemplate}
                        initialLatitude={initialLatitude}
                        initialLongitude={initialLongitude}
                        initialZoom={initialZoom}
                    />
                ) : (
                    <div className="app__renderer-placeholder">
                        <p>Cesium-based 3D globe renderer will be shown here.</p>
                        <p>This surface will eventually render the globe, markers, and user interactions.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default GeoPresenceRendererPanel;
