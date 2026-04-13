import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Map2DRendererProps {
    tileUrlTemplate: string;
    initialLatitude: number;
    initialLongitude: number;
    initialZoom: number;
}

function Map2DRenderer({
    tileUrlTemplate,
    initialLatitude,
    initialLongitude,
    initialZoom,
}: Map2DRendererProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) {
            return;
        }

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: [tileUrlTemplate],
                        tileSize: 256,
                        attribution: '© OpenStreetMap contributors',
                    },
                },
                layers: [
                    {
                        id: 'osm-tiles',
                        type: 'raster',
                        source: 'osm',
                    },
                ],
            },
            center: [initialLongitude, initialLatitude],
            zoom: initialZoom,
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [tileUrlTemplate, initialLatitude, initialLongitude, initialZoom]);

    return <div ref={mapContainerRef} className="app__map-container" />;
}

export default Map2DRenderer;
