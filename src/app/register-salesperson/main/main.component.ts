import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services'
import { Socket } from 'ngx-socket-io'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { SalesPerson } from '../../interfaces/sales-person'

import { OnExecuteData, OnExecuteErrorData, ReCaptchaV3Service } from "ng-recaptcha"

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public recentToken = "";
  public recentError?: { error: any };

  private allExecutionsSubscription: Subscription;
  private allExecutionErrorsSubscription: Subscription;
  private singleExecutionSubscription: Subscription;

  constructor(public db: DbService, public auth: AuthService, private socket: Socket, private route: ActivatedRoute, private recaptchaV3Service: ReCaptchaV3Service) { }

  ngOnInit() {

    this.allExecutionsSubscription = this.recaptchaV3Service.onExecute.subscribe(data => {
      console.log('allExecutionsSubscription', data)
    })

    this.allExecutionErrorsSubscription = this.recaptchaV3Service.onExecuteError.subscribe(data => {
      console.log('allExecutionErrorsSubscription', data)
    })

    this.singleExecutionSubscription = this.recaptchaV3Service
      .execute('registersalesperson').subscribe(token => {
          this.recentToken = token;
          this.recentError = undefined;
        }, error => {
          this.recentToken = "";
          this.recentError = { error };
        })
  }

  
  public ngOnDestroy(): void {
    if (this.allExecutionsSubscription) {
      this.allExecutionsSubscription.unsubscribe();
    }
    if (this.allExecutionErrorsSubscription) {
      this.allExecutionErrorsSubscription.unsubscribe();
    }
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
  }

}
