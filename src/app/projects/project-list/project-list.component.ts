import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { Category } from '../../interfaces/category'
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  dataSource: any = {}
  projects: Project[] = []

  categories: Category[] = []

  constructor(public db: DbService, public auth: AuthService) {

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

  }

  ngOnInit() {
  }

  initProject(e) {
    
  }

  gotoShop = (e) => {
    console.log(e)
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

    if (!project.bankinfo || !project.deliveryAdr1 || !project.deliveryAdr2 || !project.deliveryCity || !project.deliveryZipCode) {
      notify('Leverans- eller bankinformation saknas!', "error", 2000)
      return
    }

    project.active = false

    await this.saveProject(project)

    let answer = await confirm("Vill du stänga försäljningsprojektet?", "Är du säker?");

    console.log(answer)

    if (!answer) return false

    //project.active = false
    //await this.saveProject(project)

    let closeResult = await this.db.sendMessagePromise('closeproject', { system: 'grillkol', id: project.id })
    console.log(closeResult)

    notify('Projektet har stängts och beställningen är gjord hos Grillkol.se', "success", 2000)

  }

}
