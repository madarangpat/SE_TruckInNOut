import { getGeocode } from "use-places-autocomplete";

type LatLng = {
  lat: number;
  lng: number;
};

async function calculateDistance(origin: LatLng, destination: LatLng) {
  const service = new window.google.maps.DistanceMatrixService();

  return new Promise<number>((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response) {
          const distanceValue = response.rows[0].elements[0].distance.value;
          resolve(distanceValue / 1000);
        } else {
          reject("Error calculating distance");
        }
      }
    );
  });
}

async function getAddressFromLatLng(location: LatLng): Promise<string> {
  try {
    const results = await getGeocode({ location });
    if (results[0]) {
      return results[0].formatted_address;
    }
    return "Address not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
}

async function getCoordinatesFromAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  // Check if Google Maps API is available
  if (!window.google || !window.google.maps) {
    console.error("Google Maps API not loaded");
    return null;
  }

  const geocoder = new window.google.maps.Geocoder();

  return new Promise<{ lat: number; lng: number } | null>((resolve, reject) => {
    geocoder.geocode({ address: address }, (results: any, status: string) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results &&
        results.length > 0
      ) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        console.error("Geocoding failed:", status);
        resolve(null); // Resolve with null instead of rejecting to match our function signature
      }
    });
  });
}

export { calculateDistance, getAddressFromLatLng, getCoordinatesFromAddress };
