import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { Category } from '../../interfaces/category'

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  dataSource: any = {}

  categories: Category[] = []

  constructor(public db: DbService, public auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'projects', this.dataSource)

    this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'categories', token: this.db.token, condition: { active: true }, sort: { name: 1 } }).then((result: any) => {
      this.categories = result.data
    })

  }

  ngOnInit() {
  }

  initProject(e) {
    
  }

  gotoShop = (e) => {
    console.log(e)
    window.open(`/shop/${e.row.data.code}`, "_blank");
  }

}
