import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homeText = ''

  constructor(public db: DbService, public auth: AuthService) { 
    this.db.getStringSetting('hometext').then(result => {
      this.homeText = result
    })
  }

  ngOnInit() {
  }

}
