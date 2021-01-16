import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { DbService, AuthService } from '../../shared/services'
import { Socket } from 'ngx-socket-io'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  routeSubscription: Subscription

  setupCounter = 0

  constructor(public db: DbService, public auth: AuthService, private socket: Socket, private route: ActivatedRoute) {

    this.setBg()

    this.socket.emit('login', { token: this.db.token, system: 'grillkol', username: 'web', password: 'web' }, (result) => {
      console.log('Shop login', result)
      this.setup()
    })

    this.routeSubscription = this.route.params.subscribe(params => {
      console.log('Shop params')
      this.setup()
    })

  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routeSubscription.unsubscribe()
  }
  setup() {
    if (this.setupCounter++ != 1) return
    console.log('Shop setup')
  }

  setBg() {
    document.body.style.backgroundImage = `url("/assets/images/bg.jpg")`
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundAttachment = 'fixed'
  }

}
