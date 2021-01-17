import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { ShopRoutingModule } from './shop-routing.module';
import { MainComponent } from './main/main.component';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';


@NgModule({
  declarations: [MainComponent, SanitizeHtmlPipe],
  imports: [
    CommonModule,
    ShopRoutingModule,
    FontAwesomeModule
  ]
})
export class ShopModule { }
