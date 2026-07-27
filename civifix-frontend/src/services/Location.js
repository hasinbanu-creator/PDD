import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
export const Accuracy = { High: 'high' };
export async function requestForegroundPermissionsAsync() {
  if (Platform.OS === 'ios') return { status: await Geolocation.requestAuthorization('whenInUse') };
  if (Platform.OS === 'android') {
    const g = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return { status: g === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied' };
  }
  return { status: 'denied' };
}
export function getCurrentPositionAsync(opts) {
  return new Promise((res, rej) => Geolocation.getCurrentPosition(p => res({coords: {latitude: p.coords.latitude, longitude: p.coords.longitude}}), e => rej(e), {enableHighAccuracy: true}));
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
    if (data && data.address) {
      return [{
        name: data.address.building || data.address.amenity || data.address.landmark || '',
        street: data.address.road || data.address.street || '',
        locality: data.address.suburb || data.address.neighbourhood || data.address.village || '',
        city: data.address.city || data.address.town || '',
        district: data.address.county || data.address.state_district || '',
        region: data.address.state || '',
        country: data.address.country || '',
        postalCode: data.address.postcode || '',
        formattedAddress: data.display_name
      }];
    }
  } catch (e) {
    console.error("Reverse geocoding failed", e);
  }
  return [{}];
}
