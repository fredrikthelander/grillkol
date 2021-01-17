import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { DbService, AuthService } from '../../shared/services'
import { Socket } from 'ngx-socket-io'
import { Subscription } from 'rxjs'
import { Project } from '../../interfaces/project'
import { Category } from '../../interfaces/category'
import { Product } from '../../interfaces/product'
import { faShoppingCart, faPlusCircle, faMinusCircle } from '@fortawesome/pro-light-svg-icons'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  faShoppingCart = faShoppingCart; faPlusCircle = faPlusCircle; faMinusCircle = faMinusCircle;

  code = ''
  step = 5

  project: Project
  categories: Category[]
  products: Product[]

  routeSubscription: Subscription

  setupCounter = 0

  constructor(public db: DbService, public auth: AuthService, private socket: Socket, private route: ActivatedRoute) {

    this.setBg()

    this.auth.system = 'grillkol'

    this.socket.emit('login', { token: this.db.token, system: 'grillkol', username: 'web', password: 'web' }, (result) => {
      console.log('Shop login', result)
      this.setup().then((result) => {}).catch((err) => {}) 
    })

    this.routeSubscription = this.route.params.subscribe(params => {

      console.log('Shop params', params)

      if (params.code) {
        this.code = params.code
        this.setup().then((result) => {}).catch((err) => {}) 
      }

    })

  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routeSubscription.unsubscribe()
  }

  async setup() {

    if (this.setupCounter++ != 1) return

    console.log('Shop setup')

    let projects: any = await this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { code: this.code, active: true }, sort: { } })
    
    if (projects.length) {
      this.project = projects[0]
    } else {
      return false
    }

    this.categories = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'categories', token: this.db.token, condition: { id: { $in: this.project.idCategories }, active: true }, sort: { sortorder: 1 } })
    this.products = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'products', token: this.db.token, condition: { idCategory: { $in: this.project.idCategories }, active: true }, sort: { sortorder: 1 } })
    


//    Promise.all([
//      this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { code: this.code, active: true }, sort: { } }),
//      
//    ]).then((results: any[]) => {
//
//      console.log(results)
//
//      if (results[0].data.length) this.project = results[0].data[0]
//
//      if (this.project)  this.socket.emit('mget', { system: this.auth.system, table: 'categories', token: this.db.token, condition: { id: { $in: this.project.idCategories }, active: true }, sort: { sortorder: 1 } }, (result) => {
//        this.categories = result.data
//      })
//
//    }).catch((err) => {
//      console.log(err)
//    })

  }

  async getProjects() {
    let projects = await this.db.sendMessagePromise('mget', { system: this.auth.system, table: 'projects', token: this.db.token, condition: { code: this.code, active: true }, sort: { } })
    return projects
  }

  setBg() {
    document.body.style.backgroundImage = `url("/assets/images/bg.jpg")`
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundAttachment = 'fixed'
  }

  productCount() {
    return 0
  }

  cartClick() {

  }

}
