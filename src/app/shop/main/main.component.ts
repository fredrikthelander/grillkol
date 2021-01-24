import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { DbService, AuthService } from '../../shared/services'
import { Socket } from 'ngx-socket-io'
import { Subscription } from 'rxjs'
import { Project } from '../../interfaces/project'
import { Category } from '../../interfaces/category'
import { Product } from '../../interfaces/product'
import { Order, OrderItem } from '../../interfaces/order'
import { SalesPerson } from '../../interfaces/sales-person'
import { Vat } from '../../interfaces/vat'
import { faShoppingCart, faPlusCircle, faMinusCircle, faTimes } from '@fortawesome/pro-light-svg-icons'
import { v4 as uuid } from 'uuid'
import * as moment from 'moment';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  faShoppingCart = faShoppingCart; faPlusCircle = faPlusCircle; faMinusCircle = faMinusCircle; faTimes = faTimes;

  code = ''
  spcode = ''

  step = 5

  project: Project
  categories: Category[] = []
  products: Product[] = []
  vats: Vat[] = []
  salesPersons: SalesPerson[] = []
  idSelectedSalesPerson = ''

  selectedCategory: Category
  selectedItems = []

  routeSubscription: Subscription

  setupCounter = 0
  pipeHelper = 0

  order: Order = {
    id: uuid(),
    project: null,
    orderid: 0,
    fnamn: '',
    enamn: '',
    phone: '',
    email: '',
    adr1: '',
    adr2: '',
    items: [],
    ts: '',
    termsAccepted: false,
    totalIncl: 0,
    totalExcl: 0,
    totalVat: 0,
    salesPerson: null
  }

  constructor(public db: DbService, public auth: AuthService, private socket: Socket, private route: ActivatedRoute, private modal: NgxSmartModalService) {

    this.setBg()

    this.auth.system = 'grillkol'

    this.socket.emit('login', { token: this.db.token, system: 'grillkol', username: 'web', password: 'web' }, (result) => {
      console.log('Shop login', result)
      this.setup().then((result) => {}).catch((err) => {}) 
    })

    this.routeSubscription = this.route.params.subscribe(params => {

      console.log('Shop params', params)

      if (params.spcode) {
        this.spcode = params.spcode
      }

      if (params.code) {
        this.code = params.code
        this.setup().then((result) => {}).catch((err) => {}) 
      }

    })

    if (window.location.hostname == 'localhost') {
      this.order.fnamn = 'Fredrik'
      this.order.enamn = 'Thelander'
      this.order.phone = '0702696222'
      this.order.email = 'fredrikthelander@outlook.com'
      this.order.adr1 = 'Salladsvägen 10'
      this.order.adr2 = '582 75 Linköping'
      this.order.termsAccepted = true
    }

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
      this.order.project = this.project
    } else {
      return false
    }

    this.categories = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'categories', token: this.db.token, condition: { id: { $in: this.project.idCategories }, active: true }, sort: { sortorder: 1 } })
    this.products = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'products', token: this.db.token, condition: { idCategory: { $in: this.project.idCategories }, active: true }, sort: { sortorder: 1 } })
    this.vats = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'vats', token: this.db.token, condition: { active: true }, sort: { } })
    this.salesPersons = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { owner: this.project.email }, sort: { name: 1 } })

    if (this.spcode) {
      let sp = this.salesPersons.find(sp => sp.code == this.spcode)
      if (sp) this.idSelectedSalesPerson = sp.id
    }

    if (this.categories.length) this.selectedCategory = this.categories[0]


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

  cartClick() {
    if (this.selectedItems.length) this.step = 6
  }

  setCat(cat) {
    console.log('Setting cat', cat)
    this.selectedCategory = cat
  }

  del(p) {

    let si = this.selectedItems.find(si => si.idProduct == p.id)

    if (si) {
      si.quantity -= 1
      if (si.quantity < 1) this.selectedItems = this.selectedItems.filter(si => si.idProduct != p.id)
    }
    
    this.pipeHelper++

  }

  add(p) {

    let si = this.selectedItems.find(si => si.idProduct == p.id)

    if (si) {
      si.quantity += 1
      si.amount = si.quantity * si.product.priceIncl
    } else {
      
      let itemToAdd = {
        id: uuid(),
        idProduct: p.id,
        product: p,
        quantity: 1,
        amount: p.priceIncl
      }

      this.selectedItems.push(itemToAdd)
      
    }

    this.pipeHelper++

  }

  close() {
    this.step = 5
  }

  delItem(selectedItem) {
    this.selectedItems = this.selectedItems.filter(si => si.id != selectedItem.id)
    if (!this.selectedItems.length) this.step = 5
    this.pipeHelper++
  }

  orderClick(args) {
    
    if (!args.validationGroup.validate().isValid) return

    this.createOrder().then(result => {
      console.log('Createorder result', result)
    }).catch(err => {
      console.log('Createorder err', err)
    })

  }

  async createOrder() {

    let next: any = await this.db.sendMessagePromise('nextorderid', { system: 'grillkol' })
    let orderid = next.result.nextOrderid || null
    if (!orderid) return false

    this.order.orderid = orderid
    this.order.ts = moment().format('YYYY-MM-DD HH:mm:ss')

    this.order.items = []
    this.order.totalIncl = 0
    this.order.totalExcl = 0
    this.order.totalVat = 0

    this.selectedItems.forEach(si => {

      let vatPercent = this.getVatPercent(si.product.idVat)
      let totalExcl = si.amount / (1 + vatPercent / 100)

      this.order.totalIncl += si.amount
      this.order.totalExcl += totalExcl
      this.order.totalVat += si.amount - totalExcl

      let orderItem: OrderItem = {
        id: uuid(),
        product: si.product,
        quantity: si.quantity,
        total: si.amount,
        totalExcl: totalExcl,
        vatAmount: si.amount - totalExcl,
        vatPercent: vatPercent
      }

      this.order.items.push(orderItem)

    })

    if (this.idSelectedSalesPerson) {
      let sp = this.salesPersons.find(sp => sp.id == this.idSelectedSalesPerson)
      if (sp) this.order.salesPerson = sp
    }

    this.socket.emit('minsert', { token: this.db.token, system: 'grillkol', table: 'orders', data: this.order }, (result) => {
        this.step = 10
      //  setTimeout(() => { location.assign('https://grillkol.se') }, 30 * 1000)
    })

    return

    let swishRequest = {
      system: 'grillkol',
      payerAlias: `46${this.order.phone.substr(1)}`,
      payeePaymentReference: this.order.orderid.toString(),
      amount: this.order.totalIncl,
      message: `Order ${this.order.orderid}`
    }

    let sr: any = await this.db.sendMessagePromise('swishrequest', swishRequest)
    console.log('swishrequest result', sr)

    if (sr.err) {

    } else {
      this.step = 8
    }

    //this.socket.emit('swishrequest', swishRequest, result => {
    //  console.log('swishrequest result', result)
    //  this.step = 8
    //})

  }

  getVatPercent(idVat: string): number {
    let vatPercent = 0
    let v = this.vats.find(v => v.id == idVat)
    if (v) vatPercent = v.vatPercent
    return vatPercent
  }

  checkComparison() {
    return true;
  }

  showTerms() {
    let t = `    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel dui vitae elit fringilla imperdiet id vitae mauris. Nullam sit amet massa ac libero pulvinar pulvinar. In eget elit dignissim, tempus lacus quis, malesuada leo. Vestibulum sed odio quis metus iaculis lobortis eget vel nunc. Morbi suscipit a lorem et commodo. Duis porttitor sagittis ex, sit amet malesuada ipsum imperdiet at. Integer molestie nec urna a tempus.

    Duis id nunc diam. Nunc consectetur suscipit risus vitae ullamcorper. Aliquam condimentum condimentum enim, sit amet pretium turpis. Suspendisse id justo eu neque accumsan euismod. Etiam nec tincidunt purus, sollicitudin gravida metus. Quisque feugiat urna dui, quis porttitor ipsum semper quis. Nulla in est commodo, rutrum erat et, imperdiet dui. Proin aliquam convallis faucibus. Suspendisse magna diam, aliquam a posuere non, ornare a felis. In volutpat eros condimentum placerat consectetur. Pellentesque vel dapibus urna. Cras ac interdum ante.
    
    Sed faucibus tincidunt nulla non pellentesque. In suscipit est vel enim commodo pretium. Nam eu magna sed lorem bibendum aliquet. Nulla facilisi. Vestibulum viverra ullamcorper erat eu placerat. Quisque ultrices nisl vel est ullamcorper pulvinar. Vestibulum ultricies velit nunc, tempor tristique libero dignissim eu. Aenean elementum a nunc at ullamcorper. Etiam tincidunt pharetra porttitor. Vestibulum finibus lectus eget arcu fringilla, pulvinar fringilla arcu semper. Donec efficitur sodales sapien, at hendrerit nibh sollicitudin sit amet. Donec mattis semper metus, quis iaculis enim porttitor ut. Duis venenatis eget leo at molestie.
    
    Maecenas accumsan diam ex, at interdum est consequat quis. Sed cursus semper velit a auctor. Duis consectetur pulvinar nibh, a rhoncus magna. Integer commodo neque quis finibus consectetur. Cras commodo ut ante ac fringilla. Praesent ipsum ex, placerat at diam non, imperdiet pellentesque ipsum. Fusce at sagittis velit. Donec nec cursus diam. Etiam posuere diam scelerisque ligula volutpat consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hendrerit et mauris quis condimentum. In blandit nulla sit amet leo eleifend tristique.
    
    Nunc rutrum sapien et sem viverra cursus at in ligula. Aenean quis nunc eros. Integer rhoncus ligula non est tristique euismod. Quisque eleifend enim non dapibus pulvinar. Nullam elementum arcu at turpis consectetur, vitae fermentum tortor tincidunt. Vestibulum semper nisi eu odio tincidunt placerat. Vivamus aliquet consequat dignissim. Quisque quis mauris eros. Praesent sem lorem, euismod id nibh eget, venenatis dignissim massa. Donec sed ullamcorper diam. Etiam convallis arcu aliquam velit gravida, ac accumsan nunc feugiat. In eleifend, magna pulvinar faucibus commodo, elit turpis volutpat mauris, a placerat lacus est et ex. Sed non mi ipsum. Nullam quam leo, vehicula id luctus nec, consectetur a nunc. Nullam sagittis sed orci pretium venenatis. 
`
    this.modal.create('termsModal', 'content').open()
  }

}
