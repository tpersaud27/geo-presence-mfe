import { useEffect, useRef } from 'react';
import {
    Cartesian3,
    Color,
    ImageryLayer,
    Math as CesiumMath,
    SceneMode,
    UrlTemplateImageryProvider,
    Viewer,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { PresenceUser } from '../core/models/presenceUser';
import type { MapSearchTarget } from '../core/models/mapSearchTarget';

interface Globe3DRendererProps {
    tileUrlTemplate: string;
    initialLatitude: number;
    initialLongitude: number;
    initialZoom: number;
    selectedUser: PresenceUser | null;
    mapSearchTarget: MapSearchTarget | null;
}

function Globe3DRenderer({
    tileUrlTemplate,
    initialLatitude,
    initialLongitude,
    initialZoom,
    selectedUser,
    mapSearchTarget,
}: Globe3DRendererProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewerRef = useRef<Viewer | null>(null);

    useEffect(() => {
        if (!containerRef.current || viewerRef.current) {
            return;
        }

        const viewer = new Viewer(containerRef.current, {
            baseLayer: false,
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            fullscreenButton: false,
            infoBox: false,
            selectionIndicator: false,
            sceneMode: SceneMode.SCENE3D,
        });

        const imageryProvider = new UrlTemplateImageryProvider({
            url: tileUrlTemplate,
            credit: '© OpenStreetMap contributors',
        });

        viewer.imageryLayers.add(new ImageryLayer(imageryProvider));
        viewer.scene.globe.baseColor = Color.BLACK;

        const height = Math.max(1500000, 12000000 / Math.max(initialZoom, 1));

        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(
                initialLongitude,
                initialLatitude,
                height
            ),
            orientation: {
                heading: 0,
                pitch: CesiumMath.toRadians(-45),
                roll: 0,
            },
        });

        viewerRef.current = viewer;

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, [tileUrlTemplate, initialLatitude, initialLongitude, initialZoom]);

    useEffect(() => {
        const viewer = viewerRef.current;

        if (!viewer) {
            return;
        }

        if (mapSearchTarget) {
            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(
                    mapSearchTarget.lon,
                    mapSearchTarget.lat,
                    1200000
                ),
                orientation: {
                    heading: 0,
                    pitch: CesiumMath.toRadians(-45),
                    roll: 0,
                },
                duration: 1.2,
            });
            return;
        }

        if (selectedUser) {
            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(
                    selectedUser.coordinates.lon,
                    selectedUser.coordinates.lat,
                    900000
                ),
                orientation: {
                    heading: 0,
                    pitch: CesiumMath.toRadians(-45),
                    roll: 0,
                },
                duration: 1.2,
            });
            return;
        }

        const height = Math.max(1500000, 12000000 / Math.max(initialZoom, 1));

        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(
                initialLongitude,
                initialLatitude,
                height
            ),
            orientation: {
                heading: 0,
                pitch: CesiumMath.toRadians(-45),
                roll: 0,
            },
            duration: 1.2,
        });
    }, [mapSearchTarget, selectedUser, initialLatitude, initialLongitude, initialZoom]);

    return <div ref={containerRef} className="app__globe-container" />;
}

export default Globe3DRenderer;
