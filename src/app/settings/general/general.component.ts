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

  constructor(public db: DbService, public auth: AuthService) { 
    this.go().then().catch()
  }

  ngOnInit() {
  }

  async go() {
    this.homeText = await this.db.getStringSetting('hometext')
  }

  saveHomeText(v) {
    this.db.setStringSetting('hometext', v).then().catch()
  }

}
