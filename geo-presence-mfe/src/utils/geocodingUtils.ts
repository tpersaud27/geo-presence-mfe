import type { MapSearchTarget } from '../core/models/mapSearchTarget';

interface NominatimSearchResult {
    lat: string;
    lon: string;
    display_name: string;
}

function buildSearchUrl(searchUrl: string, query: string, limit: number): string {
    const url = new URL(searchUrl);
    url.searchParams.set('q', query.trim());
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', String(limit));
    return url.toString();
}

function mapResultToTarget(result: NominatimSearchResult): MapSearchTarget {
    return {
        label: result.display_name,
        lat: Number(result.lat),
        lon: Number(result.lon),
        zoom: 9,
    };
}

export async function searchPlaceByName(
    searchUrl: string,
    query: string
): Promise<MapSearchTarget | null> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return null;
    }

    const response = await fetch(buildSearchUrl(searchUrl, trimmedQuery, 1), {
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

    return mapResultToTarget(results[0]);
}

export async function searchPlaceSuggestions(
    searchUrl: string,
    query: string
): Promise<MapSearchTarget[]> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || trimmedQuery.length < 2) {
        return [];
    }

    const response = await fetch(buildSearchUrl(searchUrl, trimmedQuery, 5), {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Suggestion request failed with status ${response.status}`);
    }

    const results = (await response.json()) as NominatimSearchResult[];

    return results.map(mapResultToTarget);
}
