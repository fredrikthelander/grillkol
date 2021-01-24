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

  constructor(public db: DbService, private auth: AuthService) {

    if (this.auth.userlevel > 1) this.db.createDataSource(this.auth.system, 'orders', this.dataSource)

  }

  ngOnInit() {
  }

}
