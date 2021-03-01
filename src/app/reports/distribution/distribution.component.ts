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

  //projects: Project[] = []
  project: Project
  orders: Order[] = []  
  salesPersons: SalesPerson[] = []
  distribution = []

  constructor(public auth: AuthService, private db: DbService) {}

  ngOnInit() {
  }

  async setup() {

    this.orders = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: { "project.id": this.project.id }, sort: { } })
    this.salesPersons = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { owner: this.project.email }, sort: { } })

    this.distribution = []
    

      this.orders.filter(order => order.project.id == this.project.id).forEach(order => {

        let d = this.distribution.find(d => d.idSalesPerson == order.salesPerson.id)

        if (d) {
          d.totalIncl += order.totalIncl
          d.orders.push(this.stripOrder(order))
          d.orderCount++
        } else {
          this.distribution.push({ idSalesPerson: order.salesPerson.id, code: '', name: '', totalIncl: order.totalIncl, percentage: 0, orderCount: 1, orders: [this.stripOrder(order)] })
        }

      })

      this.salesPersons.forEach(salesPerson => {

        let d = this.distribution.find(d => d.idSalesPerson == salesPerson.id)

        if (d) {
          d.name = salesPerson.name
          d.code = salesPerson.code
        } else {
          this.distribution.push({ idSalesPerson: salesPerson.id, name: salesPerson.name, totalIncl: 0, percentage: 0, orderCount: 0, orders: [] })
        }

      })

      let total = this.distribution.reduce((ack, d) =>  ack += d.totalIncl, 0)

      this.distribution.forEach(d => {
        if (d.totalIncl) d.percentage = Math.round(d.totalIncl / total * 10000) / 100
      })


  }

  stripOrder(order: Order): any {
    
    let so: any = {}

    so.orderid = order.orderid
    so.fnamn = order.fnamn
    so.enamn = order.enamn
    so.items = []

    order.items.forEach(oi => {
      
      so.items.push({
        product:{ sku: oi.product.sku, name: oi.product.name, priceIncl: oi.product.priceIncl },
        quantity: oi.quantity,
        total: oi.total
      })

    })

    return so

  }

  projectChanged(project) {
    this.project = project
    this.setup().then((result) => {}).catch((err) => {}) 
  }

  showReport = (e) => {
    console.log(e)
    if (this.project) window.open(`/rapport/${this.project.code}/${e.row.data.code}`, "_blank");
  }

}
