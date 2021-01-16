import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import { User } from '../../interfaces/user'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  dataSource: any = {}

  popupVisible = false
  passwords = {
    p1: '',
    p2: '',
    id: ''
  }
  pwMode = 'password'

  constructor(private db: DbService, private auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'users', this.dataSource)

  }

  ngOnInit() {
  }

  initUser(u: User) {

    let user: User = {
      id: uuid(),
      username: '',
      password: '',
      systems: [this.auth.system],
      modules: ['*'],
      userlevel: 1,
      active: true
    }

    Object.entries(user).forEach(([key, value]) => {
      u[key] = value
    })

  }

  popup = (e) => {
    this.passwords.p1 = ''
    this.passwords.p2 = ''
    this.passwords.id = e.row.data.id
    this.popupVisible = true
  }

  popupOk(args) {

    if (!args.validationGroup.validate().isValid) {
      return
    }
    
    this.popupVisible = false

    console.log(this.passwords)

    this.db.socket.emit('setpw', { system: this.auth.system, id: this.passwords.id, password: this.passwords.p1 }, (result) => {
      console.log(result)
    })

  }

  togglePw() {
    this.pwMode = this.pwMode == 'normal' ? 'password' : 'normal'
  }

  setPw(e) {
    let id = e.row.data.id
    console.log(id)
    return

  }  

  passwordComparison = () => {
    return this.passwords.p1
  }

  cellTemplate(container, options) {
    var noBreakSpace = "\u00A0",
        text = (options.value || []).map(element => { return element }).join(", ")
    container.textContent = text || noBreakSpace;
    container.title = text;
  }
  

}
