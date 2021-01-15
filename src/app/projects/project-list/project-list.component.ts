import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  dataSource: any = {}

  constructor(public db: DbService, private auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'projects', this.dataSource)

  }

  ngOnInit() {
  }

  initProject(e) {
    
  }

}
