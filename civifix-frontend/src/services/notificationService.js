import messaging from '@react-native-firebase/messaging';
class NotificationService {
  async registerForPushNotificationsAsync() {
    try {
      const auth = await messaging().requestPermission();
      if(auth === messaging.AuthorizationStatus.AUTHORIZED || auth === messaging.AuthorizationStatus.PROVISIONAL) {
        return await messaging().getToken();
      }
    } catch(e){}
    return null;
  }
  async syncTokenWithServer(token) { console.log("Device token registered internally (STUB):", token); }
  setupNotificationListeners(onReceived, onResponse) {
    const unsub = messaging().onMessage(async msg => { if(onReceived) onReceived(msg); });
    const unsub2 = messaging().onNotificationOpenedApp(msg => { if(onResponse) onResponse(msg); });
    return () => { unsub(); unsub2(); };
  }
}
export default new NotificationService();
