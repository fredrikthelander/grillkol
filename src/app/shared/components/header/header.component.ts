import { Component, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService, MsgBusService } from '../../services';

import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { Subscription } from 'rxjs'

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title: string;

  userMenuItems = []

  subscription: Subscription

  constructor(private auth: AuthService, private msgBus: MsgBusService) {

    this.createUserMenuItems()

    this.subscription = this.msgBus.getMessage().subscribe(message => {

      if (message == 'login') {
        console.log('header got login')
        this.createUserMenuItems()
      }
      
    }) 

  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  }

  createUserMenuItems() {

    this.userMenuItems = []

    if (this.auth.systems.length > 1) {
      this.auth.systems.forEach(system => {
        if (system != this.auth.system) this.userMenuItems.push({
          text: system,
          icon: 'arrowright'
        })
      })
    }
    
    this.userMenuItems.push({
      text: 'Logout',
      icon: 'runner',
      onClick: () => {
        this.auth.logOut();
      }
    })

  }

}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    UserPanelModule,
    DxToolbarModule
  ],
  declarations: [ HeaderComponent ],
  exports: [ HeaderComponent ]
})
export class HeaderModule { }
