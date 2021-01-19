import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { Category } from '../../interfaces/category'

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

  saveProject(args, project) {

    if (!args.validationGroup.validate().isValid) {
      return
    }

    delete project._id

    this.db.sendMessagePromise('mupdate', { system: 'grillkol', table: 'projects', id: project.id, data: project }).then((result) => {
      //console.log('Save result', result)
    })

  }

}
