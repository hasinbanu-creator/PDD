import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export const Accuracy = { High: 'high', Balanced: 'balanced', Low: 'low' };

export async function requestForegroundPermissionsAsync() {
  if (Platform.OS === 'ios') {
    const auth = await Geolocation.requestAuthorization('whenInUse');
    return { status: auth === 'granted' ? 'granted' : 'denied' };
  }
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      const fine = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
      const coarse = granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
      if (fine || coarse) {
        return { status: 'granted' };
      }
      return { status: 'denied' };
    } catch (e) {
      console.error("Permission request error:", e);
      return { status: 'denied' };
    }
  }
  return { status: 'denied' };
}

export function getLastKnownPositionAsync() {
  return new Promise((resolve) => {
    Geolocation.getLastKnownPosition(
      (position) => {
        if (position && position.coords) {
          resolve({ coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
        } else {
          resolve(null);
        }
      },
      (error) => {
        console.log("DEBUG: getLastKnownPosition failed:", error);
        resolve(null);
      },
      { timeout: 5000, maximumAge: 60000 }
    );
  });
}

export function getCurrentPositionAsync(opts = {}) {
  return new Promise((resolve, reject) => {
    // Try high accuracy first
    Geolocation.getCurrentPosition(
      (position) => {
        if (position && position.coords) {
          resolve({ coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
        } else {
          reject({ code: 2, message: "Position unavailable" });
        }
      },
      (highAccErr) => {
        console.log("DEBUG: High accuracy geolocation failed, trying balanced accuracy:", highAccErr);
        // Fallback to standard accuracy
        Geolocation.getCurrentPosition(
          (position) => {
            if (position && position.coords) {
              resolve({ coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
            } else {
              reject(highAccErr || { code: 2, message: "Position unavailable" });
            }
          },
          (standardAccErr) => {
            console.log("DEBUG: Standard accuracy geolocation failed:", standardAccErr);
            reject(standardAccErr || highAccErr);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  });
}

export async function reverseGeocodeAsync({latitude, longitude}) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
      headers: {
        'User-Agent': 'CiviFixApp/1.0',
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    console.log("DEBUG: Nominatim reverse geocode raw response:", JSON.stringify(data, null, 2));
    if (data && data.address) {
      return [{
        houseNumber: data.address.house_number || data.address.house || data.address.flat || data.address.apartment || data.address.unit || '',
        building: data.address.building || data.address.amenity || data.address.landmark || data.address.shop || data.address.office || data.address.historic || data.address.tourism || data.address.man_made || data.address.leisure || '',
        street: data.address.road || data.address.street || data.address.pedestrian || data.address.footway || data.address.path || data.address.cycleway || data.address.track || data.address.square || '',
        locality: data.address.suburb || data.address.neighbourhood || data.address.village || data.address.sublocality || data.address.city_district || data.address.quarter || data.address.residential || data.address.farm || data.address.allotments || data.address.hamlet || '',
        ward: data.address.ward || '',
        city: data.address.city || data.address.town || data.address.municipality || '',
        district: data.address.county || data.address.state_district || data.address.district || '',
        region: data.address.state || data.address.province || data.address.region || '',
        country: data.address.country || '',
        postalCode: data.address.postcode || data.address.postal_code || '',
        formattedAddress: data.display_name
      }];
    }
  } catch (e) {
    console.error("Reverse geocoding failed", e);
  }
  return [{}];
}
