import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { Order } from '../../interfaces/order'

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  dataSource: any = {}

  orders: Order[] = []
  orderList = []

  constructor(public db: DbService, public auth: AuthService) {

    if (this.auth.userlevel > 1) this.db.createDataSource(this.auth.system, 'orders', this.dataSource)
    this.setup()
  }

  ngOnInit() {
  }

  async setup() {

    this.orders = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: {  }, sort: { } })

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

}
