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

interface Globe3DRendererProps {
    tileUrlTemplate: string;
    initialLatitude: number;
    initialLongitude: number;
    initialZoom: number;
}

function Globe3DRenderer({
    tileUrlTemplate,
    initialLatitude,
    initialLongitude,
    initialZoom,
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

    return <div ref={containerRef} className="app__globe-container" />;
}

export default Globe3DRenderer;
