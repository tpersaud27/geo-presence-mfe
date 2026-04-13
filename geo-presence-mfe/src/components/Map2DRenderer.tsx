import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { PresenceUser } from '../core/models/presenceUser';

interface Map2DRendererProps {
    users: PresenceUser[];
    tileUrlTemplate: string;
    initialLatitude: number;
    initialLongitude: number;
    initialZoom: number;
    onUserSelect: (user: PresenceUser) => void;
}

function Map2DRenderer({
    users,
    tileUrlTemplate,
    initialLatitude,
    initialLongitude,
    initialZoom,
    onUserSelect,
}: Map2DRendererProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<maplibregl.Map | null>(null);
    const markerInstancesRef = useRef<maplibregl.Marker[]>([]);

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
            markerInstancesRef.current.forEach((marker) => marker.remove());
            markerInstancesRef.current = [];

            map.remove();
            mapInstanceRef.current = null;
        };
    }, [tileUrlTemplate, initialLatitude, initialLongitude, initialZoom]);

    useEffect(() => {
        const map = mapInstanceRef.current;

        if (!map) {
            return;
        }

        markerInstancesRef.current.forEach((marker) => marker.remove());
        markerInstancesRef.current = [];

        const nextMarkers = users.map((user) => {
            const markerElement = document.createElement('button');
            markerElement.type = 'button';
            markerElement.className = 'app__map-marker';
            markerElement.title = user.displayName;
            markerElement.setAttribute('aria-label', `Select ${user.displayName}`);

            markerElement.addEventListener('click', () => {
                onUserSelect(user);
            });

            const marker = new maplibregl.Marker({ element: markerElement })
                .setLngLat([user.coordinates.lon, user.coordinates.lat])
                .addTo(map);

            return marker;
        });

        markerInstancesRef.current = nextMarkers;
    }, [users, onUserSelect]);

    return <div ref={mapContainerRef} className="app__map-container" />;
}

export default Map2DRenderer;
