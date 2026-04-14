import { useEffect, useRef } from 'react';
import {
    Cartesian2,
    Cartesian3,
    Color,
    ImageryLayer,
    LabelStyle,
    Math as CesiumMath,
    SceneMode,
    UrlTemplateImageryProvider,
    Viewer,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { PresenceUser } from '../core/models/presenceUser';
import type { MapSearchTarget } from '../core/models/mapSearchTarget';

if (typeof window !== 'undefined') {
    (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL =
        '/node_modules/cesium/Build/Cesium/';
}

interface Globe3DRendererProps {
    tileUrlTemplate?: string;
    initialLatitude: number;
    initialLongitude: number;
    initialZoom: number;
    users: PresenceUser[];
    selectedUser: PresenceUser | null;
    mapSearchTarget: MapSearchTarget | null;
}

function Globe3DRenderer({
    tileUrlTemplate,
    initialLatitude,
    initialLongitude,
    initialZoom,
    users,
    selectedUser,
    mapSearchTarget,
}: Globe3DRendererProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewerRef = useRef<Viewer | null>(null);

    useEffect(() => {
        if (!containerRef.current || viewerRef.current || !tileUrlTemplate) {
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

        viewer.scene.globe.baseColor = Color.BLACK;

        const imageryProvider = new UrlTemplateImageryProvider({
            url: tileUrlTemplate,
            credit: '© OpenStreetMap contributors',
        });

        viewer.imageryLayers.add(new ImageryLayer(imageryProvider));

        const height = Math.max(1500000, 12000000 / Math.max(initialZoom, 1));

        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(initialLongitude, initialLatitude, height),
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

        viewer.entities.removeAll();

        users.forEach((user) => {
            const isSelected = selectedUser?.id === user.id;

            viewer.entities.add({
                id: user.id,
                position: Cartesian3.fromDegrees(user.coordinates.lon, user.coordinates.lat),
                point: {
                    pixelSize: isSelected ? 14 : 10,
                    color: isSelected ? Color.ORANGE : Color.DODGERBLUE,
                    outlineColor: Color.WHITE,
                    outlineWidth: 2,
                },
                label: {
                    text: user.displayName,
                    font: '12px sans-serif',
                    fillColor: Color.WHITE,
                    outlineColor: Color.BLACK,
                    outlineWidth: 2,
                    style: LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cartesian2(0, -24),
                    show: isSelected,
                },
            });
        });
    }, [users, selectedUser]);

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
            destination: Cartesian3.fromDegrees(initialLongitude, initialLatitude, height),
            orientation: {
                heading: 0,
                pitch: CesiumMath.toRadians(-45),
                roll: 0,
            },
            duration: 1.2,
        });
    }, [mapSearchTarget, selectedUser, initialLatitude, initialLongitude, initialZoom]);

    if (!tileUrlTemplate) {
        return null;
    }

    return <div ref={containerRef} className="app__globe-container" />;
}

export default Globe3DRenderer;
