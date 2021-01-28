import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { Order } from '../../interfaces/order'
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  projects: Project[] = []
  orders: Order[] = []

  constructor(private auth: AuthService, private db: DbService, private router: Router) {

    if (this.auth.userlevel >= 4) this.router.navigate(['/reports/admin'])

    this.setup().then((result) => {}).catch((err) => {}) 

  }

  ngOnInit() {
  }

  async setup() {

    this.projects = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { email: this.auth.username, active: true }, sort: { } })
    this.orders = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: { "project.email": this.auth.username }, sort: { } })

  }

  showOrder = (e) => {
    console.log(e)
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'rubrik'
    })

  }

}
