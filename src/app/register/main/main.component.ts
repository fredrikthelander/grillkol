import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';

import { Socket } from 'ngx-socket-io'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  codeChars = '23456789ABCEFGHJKMNPQRSTWXYZ'

  vars = {
    name: '',
    persons: null,
    contactName: '',
    email: '',
    phone: '',
    catalogs: false,
    catalogAdr1: '',
    catalogAdr2: '',
    catalogAdr3: '',
    newsletter: true,
    code: '',
    password: ''
  }

  constructor(private authService: AuthService, private db: DbService, private socket: Socket) {

    this.vars.code = this.createCode()
    this.vars.password = this.createCode()

    this.socket.emit('login', { token: this.db.token, system: 'grillkol', username: 'web', password: 'web' }, (result) => {
      console.log(result)
    })
  }

  ngOnInit() {
  }
  
  onSubmit(e) {
    
  }

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
