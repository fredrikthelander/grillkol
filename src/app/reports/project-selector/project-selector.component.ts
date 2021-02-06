import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';
import { Project } from '../../interfaces/project'

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit {

  @Output()
  selectedProjectChanged = new EventEmitter<Project>();

  projects: Project[] = []

  constructor(public auth: AuthService, private db: DbService) {

    this.setup().then((result) => {}).catch((err) => {}) 

  }

  ngOnInit() {
  }

  async setup() {

    let cond: any = { email: this.auth.username }
    if (this.auth.userlevel >= 4) cond = {}

    this.projects = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: cond, sort: { name: 1 } })
  
    if (this.projects.length == 1) this.selectedProjectChanged.emit(this.projects[0])

  }

  valueChanged(e) {
    
    let id = e.value
    let project: Project = this.projects.find(p => p.id == id)
    if (project) this.selectedProjectChanged.emit(project)

  }

}
