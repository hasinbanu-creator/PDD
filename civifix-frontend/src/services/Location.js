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
