import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services'
import { Project } from '../../interfaces/project'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homeText = ''

  projects: Project[] = []

  constructor(public db: DbService, public auth: AuthService) { 

    this.db.getStringSetting('hometext').then(result => {
      this.homeText = result
    })

    this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { email: this.auth.username, active: true }, sort: { ts: 1 } }).then((result: any) => {
      this.projects = result.data
    })


  }

  ngOnInit() {
  }

}
