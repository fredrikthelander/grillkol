import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { Order } from '../../interfaces/order'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  //projects: Project[] = []
  project: Project
  orders: Order[] = []  

  constructor(public auth: AuthService, private db: DbService) {}

  ngOnInit() {
  }

  async setup() {

    //this.projects = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { email: this.auth.username, active: true }, sort: { } })
    this.orders = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: { "project.id": this.project.id }, sort: { } })

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'rubrik'
    })
  }

  projectChanged(project) {
    this.project = project
    this.setup().then((result) => {}).catch((err) => {}) 
  }

}
