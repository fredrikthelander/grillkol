import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box'

import { NgxSmartModalModule } from 'ngx-smart-modal';

import { ShopRoutingModule } from './shop-routing.module';
import { MainComponent } from './main/main.component';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { Nl2brPipe } from './pipes/nl2br.pipe';
import { CatPipePipe } from './pipes/cat-pipe.pipe';
import { ItemQuantityPipe } from './pipes/item-quantity.pipe';
import { TotalAmountPipe } from './pipes/total-amount.pipe';
import { TotalQuantityPipe } from './pipes/total-quantity.pipe';


@NgModule({
  declarations: [MainComponent, SanitizeHtmlPipe, Nl2brPipe, CatPipePipe, ItemQuantityPipe, TotalAmountPipe, TotalQuantityPipe],
  imports: [
    CommonModule,
    ShopRoutingModule,
    FontAwesomeModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule, DxSelectBoxModule,
    NgxSmartModalModule.forChild()
  ]
})
export class ShopModule { }
