import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
