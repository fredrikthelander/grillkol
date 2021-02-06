import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import * as moment from 'moment';
import { Project } from '../../interfaces/project'
import { Socket } from 'ngx-socket-io'
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  step = 0

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
    catalogZipCode: '',
    catalogCity: '',
    deliveryAdr1: '',
    deliveryAdr2: '',
    deliveryZipCode: '',
    deliveryCity: '',
    deliveryPhone: '',
    deliveryDate: '',
    newsletter: true,
    code: '',
    password: '',
    infotext: '',
    bankinfo: '',
    serviceRate: 2,
    idCategories: ['d9eaa04d-487d-4d4b-8e46-f60988880ff6'],
    ts: '',
    active: true
  }

  registerSubject = ''
  registerMessage = ''
  registerMailcopy = ''

  constructor(private auth: AuthService, private db: DbService, private socket: Socket) {

    this.auth.system = 'grillkol'

    this.vars.code = this.db.createCode()
    this.vars.password = this.db.createCode()

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
    
    this.vars.infotext = await this.db.getStringSetting('webshopinfotext')

    return true

  }
  
  async onSubmit(args) {

    if (!args.validationGroup.validate().isValid) {
      return false
    }

    this.vars.ts = moment().format('YYYY-MM-DD HH:mm:ss')
    this.vars.email = this.vars.email.toLowerCase()

    this.vars.infotext = this.vars.infotext.replace(/{name}/g, this.vars.name)

    let mailCheck: any = await this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { email: this.vars.email }, sort: { } })
    if (mailCheck.err || mailCheck.data.length) {
      notify('Mailadressen är redan registrerad', "error", 2000); 
      return
    }

    await this.socket.emit('minsert', { token: this.db.token, system: 'grillkol', table: 'projects', data: this.vars }, (result) => {
      console.log('Insert', result)
      if (!result.err) this.step = 1
      setTimeout(() => { location.assign('https://grillkol.se') }, 30 * 1000)
    })

    let user = {
      id: uuid(),
      username: this.vars.email,
      password: '',
      systems: ['grillkol'],
      modules: ['Home', 'Projekt', 'Säljare', 'Rapporter'],
      userlevel: 1,
      active: true,
      system: 'grillkol'
    }

    await this.socket.emit('minsert', { token: this.db.token, system: 'grillkol', table: 'users', data: user }, (result1) => {
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

    //this.socket.emit('sendmail', mailCommand, result => {
    //  console.log('Mail result', result)
    //})

    await this.db.sendMessagePromise('sendmail', mailCommand)

    return true

  }

  parse(s) {

    let r = s
      .replace(/{contactName}/g, this.vars.contactName)
      .replace(/{code}/g, this.vars.code)
      .replace(/{email}/g, this.vars.email)
      .replace(/{password}/g, this.vars.password)

      let c = ''

      if (this.vars.catalogs) c = `\n${this.vars.persons} kataloger skickas till:\n${this.vars.catalogAdr1}\n${this.vars.catalogAdr2}\n${this.vars.catalogZipCode} ${this.vars.catalogCity}`

      r = r.replace(/{catalogs}/g, c)

    return r
  }

}
