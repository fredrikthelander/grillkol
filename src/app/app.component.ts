import { Component, HostBinding } from '@angular/core';
import { Router, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { AuthService, ScreenService, AppInfoService, DbService, MsgBusService } from './shared/services';
import { Subscription } from 'rxjs'
import { locale } from "devextreme/localization" 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {

  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  subscription: Subscription

  constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService, public db: DbService, private msgBus: MsgBusService, private router: Router) {

    locale("sv")
    
    this.subscription = this.msgBus.getMessage().subscribe(message => {
      //console.log('app.component.ts received msgbus message', message) 
    })

    router.events.subscribe(event => {

      // Show spinner while lazy loading
      if (event instanceof RouteConfigLoadStart) {
        //console.log('Start loading')
        this.db.loading = true
      } else if (event instanceof RouteConfigLoadEnd) {
        //console.log('Loading done')
        this.db.loading = false 
      }

    })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  isAuthorized() {
    return this.authService.isLoggedIn;
  }

}
