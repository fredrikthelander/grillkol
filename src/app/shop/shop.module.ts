import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { ShopRoutingModule } from './shop-routing.module';
import { MainComponent } from './main/main.component';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { Nl2brPipe } from './pipes/nl2br.pipe';
import { CatPipePipe } from './pipes/cat-pipe.pipe';
import { ItemAmountPipe } from './pipes/item-amount.pipe';


@NgModule({
  declarations: [MainComponent, SanitizeHtmlPipe, Nl2brPipe, CatPipePipe, ItemAmountPipe],
  imports: [
    CommonModule,
    ShopRoutingModule,
    FontAwesomeModule
  ]
})
export class ShopModule { }
