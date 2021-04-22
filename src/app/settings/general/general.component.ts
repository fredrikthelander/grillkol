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
  shopTerms = ''
  readBeforeOrder = ''
  deliverSubject = ''
  deliverMessage = ''

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
    this.shopTerms = await this.db.getStringSetting('shopterms')
    this.readBeforeOrder = await this.db.getStringSetting('readbeforeorder')
    this.deliverSubject = await this.db.getStringSetting('deliversubject')
    this.deliverMessage = await this.db.getStringSetting('delivermessage')
  }

  saveHomeText(v) {
    this.db.setStringSetting('hometext', v).then().catch()
  }

  saveRegister() {
    this.db.setStringSetting('registersubject', this.registerSubject).then().catch()
    this.db.setStringSetting('registermessage', this.registerMessage).then().catch()
    this.db.setStringSetting('registermailcopy', this.registerMailcopy).then().catch()
  }

  saveDeliver() {
    this.db.setStringSetting('deliversubject', this.deliverSubject).then().catch()
    this.db.setStringSetting('delivermessage', this.deliverMessage).then().catch()
  }  

  saveInfoText() {
    this.db.setStringSetting('webshopinfotext', this.webshopInfoText).then().catch()
  }

  saveShopTerms() {
    this.db.setStringSetting('shopterms', this.shopTerms).then().catch()
  }

  saveReadBeforeOrder() {
    this.db.setStringSetting('readbeforeorder', this.readBeforeOrder).then().catch()
  }

}
