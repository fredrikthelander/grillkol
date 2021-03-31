import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { Category } from '../../interfaces/category'
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import * as moment from 'moment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Socket } from 'ngx-socket-io'

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  dataSource: any = {}
  projects: Project[] = []

  categories: Category[] = []

  rbtext = ''

  mailTo = ''
  mailSubject = ''
  mailText = ''

  constructor(public db: DbService, public auth: AuthService, private modal: NgxSmartModalService, private socket: Socket) {

    if (this.auth.userlevel > 1) {

      this.db.createDataSource(this.auth.system, 'projects', this.dataSource)

      this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'categories', token: this.db.token, condition: { active: true }, sort: { name: 1 } }).then((result: any) => {
        this.categories = result.data
      })

    } else {

      this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { email: this.auth.username }, sort: { ts: 1 } }).then((result: any) => {
        this.projects = result.data
      })

    }

    this.db.getStringSetting('readbeforeorder').then(result => {
      this.rbtext = result
    })

  }

  ngOnInit() {
  }

  initProject(e) {
    
  }

  gotoShop = (e) => {
    window.open(`/shop/${e.row.data.code}`, "_blank");
  }

  saveProjectButton(args, project) {

    if (!args.validationGroup.validate().isValid) return

    this.saveProject(project)

  }

  async saveProject(project) {

    delete project._id
    await this.db.sendMessagePromise('mupdate', { system: 'grillkol', table: 'projects', id: project.id, data: project })

    return true

  }

  async closeProjectButton(args, project: Project) {

    if (!args.validationGroup.validate().isValid) return

    if (!project.bankinfo || !project.deliveryAdr1 || !project.deliveryAdr2 || !project.deliveryCity || !project.deliveryZipCode || !project.deliveryPhone) {
      notify('Leverans- eller bankinformation saknas!', "error", 2000)
      return
    }

    if (!project.deliveryDate || moment(project.deliveryDate).isBefore(moment().add(11, 'days'))) {
      notify('Felaktigt leveransdatum', "error", 2000)
      return
    }

    let answer = await confirm("Vill du stänga försäljningsprojektet?", "Är du säker?")

    if (!answer) return false

    project.active = false
    await this.saveProject(project)

    notify('Vänta...', "success", 2000)

    let closeResult = await this.db.sendMessagePromise('closeproject', { system: 'grillkol', id: project.id })
    //console.log(closeResult)

    notify('Projektet har stängts och beställningen är gjord hos Grillkol.se', "success", 2000)

    let mailText = `Hej ${project.contactName}\n\nDin order har registrerats och bearbetas nu av oss.\n\n`
    mailText += `${project.name}\n\nLeveransadress:\n${project.deliveryAdr1}\n${project.deliveryAdr2}\n${project.deliveryZipCode} ${project.deliveryCity}\n\n`
    mailText += `Bankinformation: ${project.bankinfo}\n\n`
    mailText += `Mvh\nGrillkol.se`

    let mailCommand = {
      system: 'grillkol',
      sender: 'grillkol@bokad.se',
      subject: 'Bekräftelse',
      to: project.email + ',info@grillkol.se',
      id: project.id,
      message: mailText
    }

    this.socket.emit('sendmail', mailCommand, result => {
      //console.log('Mail result', result)
    })

  }

  disabledDates = (e) => {

    let d = moment(e.date)

    if (d.isBefore(moment().add(11, 'days'))) return true
    if (d.isoWeekday() > 5) return true

    return false

  }

  readBefore() {
    this.modal.create('readBeforeOrder', 'content').open()
  }

  email = (e) => {
    
    let project = e.row.data

    this.mailTo = project.email
    this.mailSubject = 'Leveransbesked'
    this.mailText = `Hej ${project.contactName}\n\nEr order har nu lämnat vårt lager.\n\nKollinummer: \n\nMvh\nGrillkol.se`

    this.modal.create('mailModal', 'content').open()

  }

  sendMail() {

    let mailCommand = {
      system: 'grillkol',
      sender: 'grillkol@bokad.se',
      subject: this.mailSubject,
      to: this.mailTo,
      id: 0,
      message: this.mailText
    }

    this.socket.emit('sendmail', mailCommand, result => {
      console.log('Mail result', result)
      notify('Mailet har skickats', "success", 2000)
    })

    this.modal.create('mailModal', 'content').close()

  }

  manualFortnox = async (e) => {

    let project = e.row.data
    
    if (project.active) {
      notify('Projektet får inte vara aktivt', "warning", 2000)
      return
    }

    let answer = await confirm("Vill du skicka ordern till Fortnox igen?", "Är du säker?")

    if (!answer) return false

    let closeResult = await this.db.sendMessagePromise('closeproject', { system: 'grillkol', id: project.id })
    //console.log(closeResult)

    notify('Ordern har skickats till Fortnox', "success", 2000)

  }


}
