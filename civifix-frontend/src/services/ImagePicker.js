import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';
export const MediaTypeOptions = { Images: 'photo', Videos: 'video', All: 'mixed' };
export async function getMediaLibraryPermissionsAsync() { return {status: 'granted'}; }
export async function requestMediaLibraryPermissionsAsync() { return {status: 'granted'}; }
export async function requestCameraPermissionsAsync() { return {status: 'granted'}; }
export async function launchImageLibraryAsync(options) {
  const selectionLimit = options.allowsMultipleSelection ? 5 : 1;
  const res = await launchImageLibrary({mediaType: options.mediaTypes || 'photo', includeBase64: options.base64 || false, selectionLimit});
  if(res.didCancel) return {canceled: true};
  if(res.assets && res.assets.length > 0) return {canceled: false, assets: res.assets.map(a => ({uri: a.uri, fileName: a.fileName, type: a.type, base64: a.base64}))};
  return {canceled: true};
}
export async function launchCameraAsync(options) {
  const res = await launchCamera({mediaType: options.mediaTypes || 'photo', includeBase64: options.base64 || false});
  if(res.didCancel) return {canceled: true};
  if(res.assets && res.assets.length > 0) return {canceled: false, assets: [{uri: res.assets[0].uri, fileName: res.assets[0].fileName, type: res.assets[0].type, base64: res.assets[0].base64}]};
  return {canceled: true};
}
