import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private messaging: Messaging) {}

  requestPermission(): void {
    Notification.requestPermission().then((permission)=>{
      if(permission === 'granted'){
        this.getDeviceToken()
      } else{
        console.warn('Notification permission denied:', permission)
      }
    }).catch((err)=>{
      console.error('Permission request error:', err)
    })
  }

  getDeviceToken(): any {
    getToken(this.messaging, {
      vapidKey:'BC9SlxfBqNTNVzxScY5cLF1_cDGJcOXOBg40DR4kTTkBtM8BDLUDgbyWMrgBwK5kMcKxotZHlG9Hgn3msBBTTRQ'
    }).then((token)=>{
      if(token){
        console.log('Device FCM token:', token)
      }
    })
  }

  listenForMessages(): void {
   onMessage(this.messaging, (payload)=> {
    console.log('Message received:', payload)
   })
  }
}

