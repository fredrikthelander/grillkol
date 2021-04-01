import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

import { RegisterSalespersonRoutingModule } from './register-salesperson-routing.module';

import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RegisterSalespersonRoutingModule,
    RecaptchaV3Module
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Lfw_ZYaAAAAAHTnPvAjC4MFmlWFR16wlHHn6FIY' },
  ]
})
export class RegisterSalespersonModule { }
