import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid'
import CustomStore from 'devextreme/data/custom_store'
import { AuthService} from './auth.service'
import { registerLocaleData } from '@angular/common'
import localeSwedish from '@angular/common/locales/sv'
import { Setting } from '../../interfaces/setting'

@Injectable({
  providedIn: 'root'
})
export class DbService {

  token = uuid()

  username = ''
  userlevel = 0

  constructor(public socket: Socket, private router: Router, private auth: AuthService) {

    registerLocaleData(localeSwedish)

    this.socket.on('message', (message) => {
        console.log(message)
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let url = event.urlAfterRedirects
        let redirectToLogin = true
        //if (!this.auth.isLoggedIn && !['/register', '/shop'].includes(url)) router.navigate(['/login'])
        if (url == '/register') redirectToLogin = false
        if (url.substr(0, 5) == '/shop') redirectToLogin = false
        if (url.substr(0, 8) == '/rapport') redirectToLogin = false
        if (this.auth.isLoggedIn) redirectToLogin = false
        //console.log('==>', url, redirectToLogin)
        if (redirectToLogin) router.navigate(['/login'])
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

  public sendMessagePromiseData(room, message) {
      
      let promise = new Promise((resolve, reject) => {
          this.socket.emit(room, message, (data) => {
              resolve(data.data)
          })
      })
    
      return promise
    
  }

  async getStringSetting(name: string) {
    let s: Setting = await <any>this.sendMessagePromise('mgetone', { system: this.auth.system, table: 'settings', token: this.token, condition: { name: name }, sort: { } })
    return s ? s.stringValue : ''
  }

  async setStringSetting(name: string, value: string) {
    
    let s: Setting = await <any>this.sendMessagePromise('mgetone', { system: this.auth.system, table: 'settings', token: this.token, condition: { name: name }, sort: { } })
    
    if (!s) {
      console.log('Inserting')
      let setting: Setting = {
        id: uuid(),
        name: name,
        stringValue: value,
        numericValue: null,
        booleanValue: null,
        type: 0
      }

      await this.sendMessagePromise('minsert', { system: 'grillkol', table: 'settings', data: setting }) 
      return 'insert'

    } else {
      console.log('Updating')
      await this.sendMessagePromise('mupdate', { system: 'grillkol', table: 'settings', id: s.id, data: { stringValue: value } })
      return 'update'

    }
  }

  codeChars = '23456789ABCEFGHJKMNPQRSTWXYZ'

  createCode(codeLength = 6) {

    // Create code
    var s = ''
    for (var n = 1; n <= codeLength; n++) {
      s += this.codeChars[this.getRndInteger(0, this.codeChars.length - 1)]
    }

    return s
    
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }


}
