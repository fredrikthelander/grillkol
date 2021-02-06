import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { Order } from '../../interfaces/order'
import { SalesPerson } from '../../interfaces/sales-person'

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent implements OnInit {

  projects: Project[] = []
  orders: Order[] = []  
  salesPersons: SalesPerson[] = []
  distribution = []

  constructor(public auth: AuthService, private db: DbService) {

    this.setup().then((result) => {}).catch((err) => {}) 

  }

  ngOnInit() {
  }

  async setup() {

    this.projects = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { email: this.auth.username, active: true }, sort: { } })
    this.orders = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: { "project.email": this.auth.username }, sort: { } })
    this.salesPersons = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { owner: this.auth.username }, sort: { } })

    this.projects.forEach(project => {

      this.orders.filter(order => order.project.id == project.id).forEach(order => {

        let d = this.distribution.find(d => d.idSalesPerson == order.salesPerson.id)

        if (d) {
          d.totalIncl += order.totalIncl
          d.orderCount++
        } else {
          this.distribution.push({ idSalesPerson: order.salesPerson.id, name: '', totalIncl: order.totalIncl, percentage: 0, orderCount: 1 })
        }
      })

      this.salesPersons.forEach(salesPerson => {

        let d = this.distribution.find(d => d.idSalesPerson == salesPerson.id)

        if (d) {
          d.name = salesPerson.name
        } else {
          this.distribution.push({ idSalesPerson: salesPerson.id, name: salesPerson.name, totalIncl: 0, percentage: 0, orderCount: 0 })
        }

      })

      let total = this.distribution.reduce((ack, d) =>  ack += d.totalIncl, 0)

      this.distribution.forEach(d => {
        if (d.totalIncl) d.percentage = Math.round(d.totalIncl / total * 10000) / 100
      })

    })

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'rubrik'
    })
  }

}
