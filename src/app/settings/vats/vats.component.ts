import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import { Vat } from '../../interfaces/vat'

@Component({
  selector: 'app-vats',
  templateUrl: './vats.component.html',
  styleUrls: ['./vats.component.scss']
})
export class VatsComponent implements OnInit {

  dataSource: any = {}

  constructor(private db: DbService, private auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'vats', this.dataSource)

  }

  ngOnInit() {
  }

  initVat(v: Vat) {

    let vat: Vat = {
      id: uuid(),
      name: '',
      vatPercent: 0,
      default: false,
      sortorder: 10,
      active: true
    }

    Object.entries(vat).forEach(([key, value]) => {
      v[key] = value
    })

  }

}
