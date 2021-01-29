import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { Order } from '../../interfaces/order'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  projects: Project[] = []

  constructor(public auth: AuthService, private db: DbService) {

    this.setup().then().catch()

  }

  ngOnInit() {
  }

  async setup() {

    let projects = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { active: true, id: { $ne: '05935b5f-56ff-4a8a-86ae-5ee6fea7cf01'} }, sort: {} })

    let projectIds = projects.map(p => { return p.id })

    var aggr = [
      { $match: { "project.id": { $in: projectIds } } },
      { $group: { _id: "$project.id", count: { $sum: 1 }, sum: { $sum: "$totalIncl"}, name: { $first: "$project.name"}  } },
    ]

    this.projects = await <any>this.db.sendMessagePromiseData('maggr', { system: this.auth.system, table: 'orders', token: this.db.token, aggr: aggr, sort: {} })
    
    
  }

  calculateCommission = (e) => {
    return e.sum * 0.03
  }

}
