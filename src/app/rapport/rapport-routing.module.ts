import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportMainComponent } from './rapport-main/rapport-main.component';

const routes: Routes = [
    { path: ':code/:spcode', component: RapportMainComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportRoutingModule { }
