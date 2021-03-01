import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services'
import { Socket } from 'ngx-socket-io'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { SalesPerson } from '../../interfaces/sales-person'
import { Order } from '../../interfaces/order'

@Component({
  selector: 'app-rapport-main',
  templateUrl: './rapport-main.component.html',
  styleUrls: ['./rapport-main.component.scss']
})
export class RapportMainComponent implements OnInit {

  code = ''
  spcode = ''
  setupCounter = 0

  salesPerson: SalesPerson
  orders: Order[] = []

  routeSubscription: Subscription

  constructor(public db: DbService, public auth: AuthService, private socket: Socket, private route: ActivatedRoute) {

    this.setBg()

    this.auth.system = 'grillkol'

    this.socket.emit('login', { token: this.db.token, system: 'grillkol', username: 'web', password: 'web' }, (result) => {
      this.setup().then((result) => {}).catch((err) => {}) 
    })

    this.routeSubscription = this.route.params.subscribe(params => {

      console.log('Shop params', params)

      if (params.spcode) {
        this.spcode = params.spcode
      }

      if (params.code) {
        this.code = params.code
        this.setup().then((result) => {}).catch((err) => {}) 
      }

    })    

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe()
  }

  setBg() {
    document.body.style.backgroundImage = `url("/assets/images/bg.jpg")`
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundAttachment = 'fixed'
  }

  async setup() {

    if (this.setupCounter++ != 1) return

    //this.db.sendMessagePromise('mgetone', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { code: this.code }, sort: { } }).then((result: any) => {
    //  this.salesPerson = result
    //})

    this.salesPerson = await <any>this.db.sendMessagePromise('mgetone', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { code: this.spcode }, sort: { } })

    if (!this.salesPerson) return

    this.orders = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: { "salesPerson.code": this.spcode }, sort: { orderid: 1 } })

  }

}
