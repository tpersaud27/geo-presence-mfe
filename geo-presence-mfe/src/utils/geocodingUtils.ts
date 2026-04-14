import type { MapSearchTarget } from '../core/models/mapSearchTarget';

interface NominatimSearchResult {
    lat: string;
    lon: string;
    display_name: string;
}

export async function searchPlaceByName(
    searchUrl: string,
    query: string
): Promise<MapSearchTarget | null> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return null;
    }

    const url = new URL(searchUrl);
    url.searchParams.set('q', trimmedQuery);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Geocoding request failed with status ${response.status}`);
    }

    const results = (await response.json()) as NominatimSearchResult[];

    if (!results.length) {
        return null;
    }

    const firstResult = results[0];

    return {
        label: firstResult.display_name,
        lat: Number(firstResult.lat),
        lon: Number(firstResult.lon),
        zoom: 9,
    };
}
