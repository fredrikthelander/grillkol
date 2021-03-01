import { Injectable } from '@angular/core';
import { Observable ,  Subject ,  Subscription } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MsgBusService {

  constructor() { }

  private msgBusSubject = new Subject<any>();

  sendMessage(message: string, data?: any) {
    //console.log("MsgBus sending message:", message);
    this.msgBusSubject.next({ text: message, data: data });
  }

  clearMessage() {
    this.msgBusSubject.next();
  }

  getMessage(): Observable<any> {
    //console.log('Msg bus observable created')
    return this.msgBusSubject.asObservable();
  }

}
