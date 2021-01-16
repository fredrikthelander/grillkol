import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid'
import CustomStore from 'devextreme/data/custom_store'
import { AuthService} from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class DbService {

  token = uuid()

  username = ''
  userlevel = 0

  constructor(public socket: Socket, private router: Router, private auth: AuthService) {

    this.socket.on('message', (message) => {
        console.log(message)
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let url = event.urlAfterRedirects
        if (!this.auth.isLoggedIn && !['/register', '/shop'].includes(url)) router.navigate(['/login'])
      }
    })

    this.socket.on('connect', (message) => {
        this.socket.emit('gettoken', { token: this.token }, (result) => {
            console.log('gettoken result', result)
            //if (result.err) router.navigate(['/login'])
        })
    })
    
  }

  createDataSource(system, table, dataSource, global = false) {

      dataSource.store = new CustomStore({
        key: 'id',
        load: (loadOptions: any) => { 
          if (!loadOptions.sort) loadOptions.sort = [{selector: "sortorder", desc: false}]
          return this.sendMessagePromise('loaddata', { system, table, loadOptions }) 
        },
        update: (key, values) => { return this.sendMessagePromise('mupdate', { system, table, id: key, data: values }) },
        insert: (values) => { 
          values.system = system
          return this.sendMessagePromise('minsert', { system, table, data: values }) 
        },
        remove: (key) => { return this.sendMessagePromise('mdelete', { system, table, id: key }) }
      })  

  }

  public sendMessagePromise(room, message) {
      
      let promise = new Promise((resolve, reject) => {
          this.socket.emit(room, message, (data) => {
              resolve(data)
          })
      })
    
      return promise
    
  }

}
