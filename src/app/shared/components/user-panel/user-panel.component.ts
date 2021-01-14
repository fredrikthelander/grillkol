import { Component, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services';

import { faUser } from '@fortawesome/pro-light-svg-icons'

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;

  faUser = faUser

  constructor(public auth: AuthService) {}
}

@NgModule({
  imports: [
    DxListModule,
    DxContextMenuModule,
    CommonModule,
    FontAwesomeModule
  ],
  declarations: [ UserPanelComponent ],
  exports: [ UserPanelComponent ]
})
export class UserPanelModule { }
