/**
 * Geocoding utility using OpenMaps (Nominatim) API
 * Converts addresses to accurate latitude/longitude coordinates
 */

const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

interface GeocodingResult {
  latitude: string;
  longitude: string;
}

/**
 * Geocode an address using Nominatim API
 * Returns latitude and longitude as strings
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const url = new URL(NOMINATIM_API);
    url.searchParams.append("q", address);
    url.searchParams.append("format", "json");
    url.searchParams.append("limit", "1");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "VoltWay-EV-App/1.0",
      },
    });

    if (!response.ok) {
      console.error(`Geocoding API error: ${response.status}`);
      return null;
    }

    const text = await response.text();
    if (!text) return null;

    const data = JSON.parse(text);
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`No geocoding results for address: ${address}`);
      return null;
    }

    const result = data[0];
    return {
      latitude: String(result.lat),
      longitude: String(result.lon),
    };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}

/**
 * Build a full address from station components
 */
export function buildAddress(
  address: string,
  city: string,
  state: string
): string {
  return `${address}, ${city}, ${state}, India`;
}
