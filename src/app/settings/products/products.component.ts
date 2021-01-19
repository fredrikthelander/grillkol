import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import { Product } from '../../interfaces/product'
import { Vat } from '../../interfaces/vat'
import { Category } from '../../interfaces/category'
import { fromEventPattern } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  dataSource: any = {}

  vats: Vat[] = []
  defaultIdVat = ''

  categories: Category[] = []

  constructor(private db: DbService, private auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'products', this.dataSource)

    //this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'vats', token: this.db.token, condition: { active: true}, sort: { name: 1 } }).then((result: any) => {
    //  this.vats = result.data
    //  let v = this.vats.find(v => v.default)
    //  if (v) this.defaultIdVat = v.id
    //})

    Promise.all([

      this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'vats', token: this.db.token, condition: { active: true}, sort: { name: 1 } }),
      this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'categories', token: this.db.token, condition: { active: true}, sort: { name: 1 } })

    ]).then((results: any) => {

      this.vats = results[0].data
      let v = this.vats.find(v => v.default)
      if (v) this.defaultIdVat = v.id

      this.categories = results[1].data

    })



  }

  ngOnInit() {
  }

  initProduct(p: Product) {

    let product: Product = {
      id: uuid(),
      idVat: this.defaultIdVat,
      idCategory: '',
      sku: '',
      name: '',
      description1: '',
      description2: '',
      image: '',
      stockLevel: 0,
      priceIncl: 0,
      resellerPriceIncl: 0,
      volume: 0,
      fortnoxProducts: [],
      sortorder: 10,
      active: true
    }

    Object.entries(product).forEach(([key, value]) => {
      p[key] = value
    })

  }

}
