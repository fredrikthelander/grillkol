import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import { Setting } from '../../interfaces/setting'

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  homeText = ''
  registerSubject = ''
  registerMessage = ''
  registerMailcopy = ''
  webshopInfoText = ''

  constructor(public db: DbService, public auth: AuthService) { 
    this.go().then().catch()
  }

  ngOnInit() {
  }

  async go() {
    this.homeText = await this.db.getStringSetting('hometext')
    this.registerSubject = await this.db.getStringSetting('registersubject')
    this.registerMessage = await this.db.getStringSetting('registermessage')
    this.registerMailcopy = await this.db.getStringSetting('registermailcopy')
    this.webshopInfoText = await this.db.getStringSetting('webshopinfotext')
  }

  saveHomeText(v) {
    this.db.setStringSetting('hometext', v).then().catch()
  }

  saveRegister() {
    this.db.setStringSetting('registersubject', this.registerSubject).then().catch()
    this.db.setStringSetting('registermessage', this.registerMessage).then().catch()
    this.db.setStringSetting('registermailcopy', this.registerMailcopy).then().catch()
  }

  saveInfoText() {
    this.db.setStringSetting('webshopinfotext', this.webshopInfoText).then().catch()
  }

}
