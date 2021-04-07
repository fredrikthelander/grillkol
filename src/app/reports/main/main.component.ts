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

  //projects: Project[] = []
  project: Project
  orders: Order[] = []
  orderList = []

  selectedTabIndex = 0
  tabs = [{ text: 'Projektsammanställning' }, { text: 'Ordersammanställning aktiva projekt' }]

  constructor(public auth: AuthService, private db: DbService, private router: Router) {}

  ngOnInit() {
  }

  async setup() {

    this.orders = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: { "project.id": this.project.id }, sort: { } })

    this.orderList = []

    this.orders.forEach(o => {
      
      o.items.forEach(oi => {

        let oli = this.orderList.find(oli => oli.idProduct == oi.product.id)

        if (oli) {

          oli.quantity += oi.quantity
          oli.amount += oi.total

        } else {

          this.orderList.push({
            idProduct: oi.product.id,
            name: oi.product.name,
            quantity: oi.quantity,
            amount: oi.total
          })

        }

      })

    })

  }

  projectChanged(project) {
    this.project = project
    this.setup().then((result) => {}).catch((err) => {}) 
  }


}
