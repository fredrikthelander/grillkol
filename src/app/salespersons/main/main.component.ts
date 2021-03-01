import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { SalesPerson } from '../../interfaces/sales-person'
import { v4 as uuid } from 'uuid'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  salesPersons: SalesPerson[] = []
  project: Project

  constructor(public db: DbService, public auth: AuthService) {

    this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { owner: this.auth.username }, sort: { } }).then((result: any) => {
      this.salesPersons = result.data
    })

    this.db.sendMessagePromise('mgetone', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { email: this.auth.username, active: true }, sort: { } }).then((result: any) => {
      this.project = result
    })


  }

  ngOnInit() {
  }

  initSalesPerson(sp: SalesPerson) {
    
    let salesPerson: SalesPerson = {
      id: uuid(),
      owner: this.auth.username,
      name: '',
      email: '',
      code: this.db.createCode()
    }

    Object.entries(salesPerson).forEach(([key, value]) => {
      sp[key] = value
    })    
  }

  inserted(e) {
    let sp = e.data
    delete sp.__KEY__
    this.db.sendMessagePromise('minsert', { system: this.auth.system, table: 'salespersons', data: sp })
  }

  updated(e) {
    let sp = e.data
    delete sp._id
    this.db.sendMessagePromise('mupdate', { system: this.auth.system, id: sp.id, table: 'salespersons', data: sp })
  }

  removed(e) {
    let sp = e.data
    this.db.sendMessagePromise('mdelete', { system: this.auth.system, id: sp.id, table: 'salespersons' })
  }

  gotoShop = (e) => {
    if (this.project) window.open(`/shop/${this.project.code}/${e.row.data.code}`, "_blank");
  }

  showReport = (e) => {
    if (this.project) window.open(`/rapport/${this.project.code}/${e.row.data.code}`, "_blank");
  }

}
