import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { PresenceUser } from '../core/models/presenceUser';
import type { MapSearchTarget } from '../core/models/mapSearchTarget';

interface Map2DRendererProps {
    users: PresenceUser[];
    selectedUser: PresenceUser | null;
    tileUrlTemplate: string;
    initialLatitude: number;
    initialLongitude: number;
    initialZoom: number;
    mapSearchTarget: MapSearchTarget | null;
    onUserSelect: (user: PresenceUser) => void;
}

function Map2DRenderer({
    users,
    selectedUser,
    tileUrlTemplate,
    initialLatitude,
    initialLongitude,
    initialZoom,
    mapSearchTarget,
    onUserSelect,
}: Map2DRendererProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<maplibregl.Map | null>(null);
    const markerInstancesRef = useRef<maplibregl.Marker[]>([]);
    const popupInstanceRef = useRef<maplibregl.Popup | null>(null);

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

        const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 16,
        });

        mapInstanceRef.current = map;
        popupInstanceRef.current = popup;

        return () => {
            markerInstancesRef.current.forEach((marker) => marker.remove());
            markerInstancesRef.current = [];

            popup.remove();
            popupInstanceRef.current = null;

            map.remove();
            mapInstanceRef.current = null;
        };
    }, [tileUrlTemplate, initialLatitude, initialLongitude, initialZoom]);

    useEffect(() => {
        const map = mapInstanceRef.current;
        const popup = popupInstanceRef.current;

        if (!map || !popup) {
            return;
        }

        markerInstancesRef.current.forEach((marker) => marker.remove());
        markerInstancesRef.current = [];

        const nextMarkers = users.map((user) => {
            const isSelected = selectedUser?.id === user.id;

            const markerElement = document.createElement('button');
            markerElement.type = 'button';
            markerElement.className = isSelected
                ? 'app__map-marker app__map-marker--selected'
                : 'app__map-marker';
            markerElement.title = user.displayName;
            markerElement.setAttribute('aria-label', `Select ${user.displayName}`);

            markerElement.addEventListener('click', () => {
                onUserSelect(user);
            });

            markerElement.addEventListener('mouseenter', () => {
                const statusClass =
                    user.status === 'online'
                        ? 'app__map-popup-status app__map-popup-status--online'
                        : 'app__map-popup-status app__map-popup-status--offline';

                const popupHtml = `
          <div class="app__map-popup">
            <img
              src="${user.avatarUrl ?? ''}"
              alt="${user.displayName}"
              class="app__map-popup-avatar"
            />
            <div class="app__map-popup-content">
              <p class="app__map-popup-name">${user.displayName}</p>
              <p class="${statusClass}">
                ${user.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        `;

                popup
                    .setLngLat([user.coordinates.lon, user.coordinates.lat])
                    .setHTML(popupHtml)
                    .addTo(map);
            });

            markerElement.addEventListener('mouseleave', () => {
                popup.remove();
            });

            const marker = new maplibregl.Marker({ element: markerElement })
                .setLngLat([user.coordinates.lon, user.coordinates.lat])
                .addTo(map);

            return marker;
        });

        markerInstancesRef.current = nextMarkers;
    }, [users, selectedUser, onUserSelect]);

    useEffect(() => {
        const map = mapInstanceRef.current;

        if (!map) {
            return;
        }

        if (mapSearchTarget) {
            map.easeTo({
                center: [mapSearchTarget.lon, mapSearchTarget.lat],
                zoom: mapSearchTarget.zoom ?? 9,
                duration: 900,
            });
            return;
        }

        if (selectedUser) {
            map.easeTo({
                center: [selectedUser.coordinates.lon, selectedUser.coordinates.lat],
                zoom: Math.max(map.getZoom(), 8),
                duration: 800,
            });
            return;
        }

        if (users.length === 0) {
            map.easeTo({
                center: [initialLongitude, initialLatitude],
                zoom: initialZoom,
                duration: 800,
            });
            return;
        }

        if (users.length === 1) {
            const user = users[0];

            map.easeTo({
                center: [user.coordinates.lon, user.coordinates.lat],
                zoom: 8,
                duration: 800,
            });
            return;
        }

        const bounds = new maplibregl.LngLatBounds();

        users.forEach((user) => {
            bounds.extend([user.coordinates.lon, user.coordinates.lat]);
        });

        map.fitBounds(bounds, {
            padding: 60,
            maxZoom: 8,
            duration: 800,
        });
    }, [users, selectedUser, mapSearchTarget, initialLatitude, initialLongitude, initialZoom]);

    return <div ref={mapContainerRef} className="app__map-container" />;
}

export default Map2DRenderer;
