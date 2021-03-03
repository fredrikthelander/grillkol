import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { SalesPerson } from '../../interfaces/sales-person'
import { v4 as uuid } from 'uuid'
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  salesPersons: SalesPerson[] = []
  project: Project
  selectedRowKeys = []

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

  async sendMail(spgrid) {

    let answer = await confirm("Vill du skicka mail till valda säljare?", 'Är du säker?')
    if (!answer) return false

    this.db.loading = true

    //let ids = this.selectedRowKeys.map(srk => { return srk.id })
    let adresses  = this.selectedRowKeys.filter(srk => srk.email).map(srk => { return srk.email })
    console.log(1, adresses)

    //let salesPersons = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { id: this.selectedRowKeys }, sort: { } })
    //console.log(2, salesPersons)

    setTimeout(() => {
      this.db.loading = false
      spgrid.instance.deselectAll()
      notify('Mail har skickats!', "success", 2000)
    }, 3000)
  }

}
