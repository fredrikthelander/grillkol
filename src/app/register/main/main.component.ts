import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import * as moment from 'moment';
import { Project } from '../../interfaces/project'
import { Socket } from 'ngx-socket-io'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  step = 0

  codeChars = '23456789ABCEFGHJKMNPQRSTWXYZ'

  vars: Project = {
    id: uuid(),
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
    password: '',
    infotext: '',
    bankinfo: '',
    idCategories: ['d9eaa04d-487d-4d4b-8e46-f60988880ff6', '83bdca30-d674-486a-8907-a152b7134cbf'],
    ts: '',
    active: true
  }

  registerSubject = ''
  registerMessage = ''
  registerMailcopy = ''

  constructor(private auth: AuthService, private db: DbService, private socket: Socket) {

    this.auth.system = 'grillkol'

    this.vars.code = this.createCode()
    this.vars.password = this.createCode()

    this.socket.emit('login', { token: this.db.token, system: 'grillkol', username: 'web', password: 'web' }, (result) => {
      
      console.log(result)
      this.setup().then().catch()

    })


  }

  ngOnInit() {
  }

  async setup() {
    this.registerSubject = await this.db.getStringSetting('registersubject')
    this.registerMessage = await this.db.getStringSetting('registermessage')
    this.registerMailcopy = await this.db.getStringSetting('registermailcopy')
    return true
  }
  
  onSubmit(args) {

    if (!args.validationGroup.validate().isValid) {
      return
    }

    console.log(args)

    this.vars.ts = moment().format('YYYY-MM-DD HH:mm:ss')

    this.socket.emit('minsert', { token: this.db.token, system: 'grillkol', table: 'projects', data: this.vars }, (result) => {
      console.log('Insert', result)
      if (!result.err) this.step = 1
      setTimeout(() => { location.assign('https://grillkol.se') }, 30 * 1000)
    })

    let user = {
      id: uuid(),
      username: this.vars.email,
      password: '',
      systems: ['grillkol'],
      modules: ['Home', 'Ordrar', 'Projekt', 'Rapporter'],
      userlevel: 1,
      active: true,
      system: 'grillkol'
    }

    this.socket.emit('minsert', { token: this.db.token, system: 'grillkol', table: 'users', data: user }, (result1) => {
      this.db.socket.emit('setpw', { system: 'grillkol', id: user.id, password: this.vars.password }, (result2) => {
        console.log(result1, result2)
      })
    })

    let mailCommand = {
      system: 'grillkol',
      sender: 'grillkol@bokad.se',
      subject: this.registerSubject,
      to: this.vars.email + `,${this.registerMailcopy}`,
      id: this.vars.id,
      message: this.parse(this.registerMessage)
    }

    this.socket.emit('sendmail', mailCommand, result => {
      console.log('Mail result', result)
    })

  }

  parse(s) {
    return s
      .replace(/{contactName}/g, this.vars.contactName)
      .replace(/{code}/g, this.vars.code)
      .replace(/{email}/g, this.vars.email)
      .replace(/{password}/g, this.vars.password)
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
