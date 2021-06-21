import { Component, OnInit } from '@angular/core';
import { AuthService, DbService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import * as moment from 'moment';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent implements OnInit {

  totals = []

  selectedTabIndex = 0
  tabs = [{ text: 'Lista' }, { text: 'Diagram' }]

  constructor(public db: DbService, private auth: AuthService) {
    this.getData()
  }

  ngOnInit() {
  }

  async getData() {

    let result1 = await <any>this.db.sendMessagePromiseData('mcount', { system: this.auth.system, table: 'orders', token: this.db.token, condition: {  } })
    

    var aggr = [
      { $match: { ts: { $regex: `^${moment().format('YYYY')}` } } },
      { $group: { _id: "$project.id", count: { $sum: 1 }, sum: { $sum: "$totalIncl"}, name: { $first: "$project.name"}  } }
    ]

    let result2 = await <any>this.db.sendMessagePromiseData('maggr', { system: this.auth.system, table: 'orders', token: this.db.token, aggr: aggr, sort: {} })
    console.log('==>', result2)

    let totAmount = result2.reduce((acc, r) => acc += r.sum, 0)

    this.totals.push({ id: uuid(), name: 'Total försäljning', value: totAmount })
    this.totals.push({ id: uuid(), name: 'Totalt antal ordrar', value: result1 })
    this.totals.push({ id: uuid(), name: 'Genomsnittligt orderbelopp', value: totAmount / result1 })
    this.totals.push({ id: uuid(), name: 'Antal aktiva föreningar', value: result2.length })
    this.totals.push({ id: uuid(), name: 'Antal ordrar per förening (genomsnitt)', value: result1 / result2.length })

    //let aggr1 = [
    //  { $match: { deliveryDate: { $gte: startDate.format('YYYY-MM-DD') } } },
    //  { $group: { _id: "$deliveryDate", total: { $sum: "$totalAmount" }, count: { $sum: 1 }, average: { $avg: "$totalAmount" } } },
    //  { $sort: { _id: 1 } }
    //]
    


  }

  tabChange(e) {}

}
