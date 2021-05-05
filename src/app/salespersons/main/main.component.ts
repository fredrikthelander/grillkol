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

    this.db.sendMessagePromise('mgetone', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { email: this.auth.username }, sort: { } }).then((result: any) => {
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

    let mailCommand = {
      system: 'grillkol',
      sender: 'grillkol@bokad.se',
      subject: 'Försäljningslänk grillkol.se',
      to: '',
      id: '1',
      message: ''
    }

    for (let salesPerson of this.selectedRowKeys) {

      console.log('>>', salesPerson.name, salesPerson.email)

      mailCommand.to = salesPerson.email
      mailCommand.message = `Hej ${salesPerson.name}, \n\nHär kommer länk till din butik hos Grillkol.se. Skicka länken till de som ska handla i butiken under ditt namn.\n\n`
      mailCommand.message += `Butikslänk: https://grillkol.bokad.se/shop/${this.project.code}/${salesPerson.code}\n\n`
      mailCommand.message += `Du har även en personlig länk där du kan se vilka ordrar som gjorts i ditt namn:\n`
      mailCommand.message += `https://grillkol.bokad.se/rapport/${this.project.code}/${salesPerson.code}\n\n`
      mailCommand.message += `Med vänliga hälsningar,\n${this.project.name}`

      if (salesPerson.email) await this.db.sendMessagePromise('sendmail', mailCommand)

    }

    this.db.loading = false
    spgrid.instance.deselectAll()
    notify('Mail har skickats!', "success", 2000)

    //

//    //let ids = this.selectedRowKeys.map(srk => { return srk.id })
//    let adresses  = this.selectedRowKeys.filter(srk => srk.email).map(srk => { return srk.email })
//    console.log(1, adresses)
//
//    //let salesPersons = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { id: this.selectedRowKeys }, sort: { } })
//    //console.log(2, salesPersons)
//
//    setTimeout(() => {
//      this.db.loading = false
//      spgrid.instance.deselectAll()
//      notify('Mail har skickats!', "success", 2000)
//    }, 3000)
  }

  checkRemoveSalesPerson(e) {
    e.cancel = (async () => {


      let rows = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: { "salesPerson.id": e.key.id }, sort: { } })
      if (rows.length) throw TypeError('Det finns ordrar på denna person/lag. Kan ej tas bort.')

      return false

    })()
  }  

}



