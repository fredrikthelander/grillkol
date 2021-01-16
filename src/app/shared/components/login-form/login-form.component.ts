import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Socket } from 'ngx-socket-io'

import { AuthService, AppInfoService, DbService, MsgBusService } from '../../services';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';

import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  vars = {
    system : 'grillkol',
    username: '',
    password: '',
    remember: false
  }

  constructor(private authService: AuthService, public appInfo: AppInfoService, private db: DbService, private socket: Socket, private msgBus: MsgBusService) {

    let v = localStorage.getItem('loginvars')
    if (v) this.vars = JSON.parse(v)

  }

  onLoginClick(args) {

    if (!args.validationGroup.validate().isValid) {
      return
    }

    this.vars.system = this.vars.system.toLowerCase()
    this.vars.username = this.vars.username.toLowerCase()

    this.socket.emit('login', { token: this.db.token, system: this.vars.system, username: this.vars.username, password: this.vars.password }, (result) => {
      
      console.log('Login result', result)

      if (result.result && result.result == 'Ok') {

        this.authService.logIn(this.vars.username, this.vars.password)
        this.authService.username = this.vars.username
        this.authService.system = this.vars.system
        this.authService.systems = result.systems || []
        this.authService.modules = result.modules || []
        this.msgBus.sendMessage('login')

        this.vars.password = ''
    
        if (this.vars.remember) {
          localStorage.setItem('loginvars', JSON.stringify(this.vars))
        } else {
          localStorage.removeItem('loginvars')
        }
    
        args.validationGroup.reset();

      } else {
        notify('Login error', 'error', 1000)
        return
      }

    })

  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule
  ],
  declarations: [ LoginFormComponent ],
  exports: [ LoginFormComponent ]
})
export class LoginFormModule { }
