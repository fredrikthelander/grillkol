import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  dataSource: any = {}

  constructor(public db: DbService, private auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'orders', this.dataSource)

  }

  ngOnInit() {
  }

}
