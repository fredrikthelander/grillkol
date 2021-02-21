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
import notify from 'devextreme/ui/notify';

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

  shopTerms = ''

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

    this.socket.on('swish', message => {

      if (message.result == 'PAID') {
        this.step = 10
      } else {
        this.step = 9
      }

      // 15 sek
      setTimeout(() => { location.assign('https://grillkol.se') }, 15 * 1000)

    })

    // 10 min timeout
    setTimeout(() => { location.assign('https://grillkol.se') }, 10 * 60 * 1000)

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

    this.shopTerms = await this.db.getStringSetting('shopterms')


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
      p.stocklevel += 1
      if (si.quantity < 1) this.selectedItems = this.selectedItems.filter(si => si.idProduct != p.id)
    }
    
    this.pipeHelper++

  }

  add(p) {

    if (p.stocklevel < 1) return

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

    p.stocklevel -= 1
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
    
    let swishRequest = {
      system: 'grillkol',
      payerAlias: `46${this.order.phone.substr(1)}`,
      payeePaymentReference: this.order.orderid.toString(),
      amount: this.order.totalIncl,
      message: `Order ${this.order.orderid}`
    }

    let sr: any = await this.db.sendMessagePromise('swishrequest', swishRequest)
    //console.log('swishrequest result', sr)

    if (sr.err) {
      notify('Kan inte aktivera Swishbetalning på angivet nummer', 'error', 2000);
    } else {
      this.socket.emit('minsert', { token: this.db.token, system: 'grillkol', table: 'unpaidorders', data: this.order }, (result) => {})
      this.step = 8
    }

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
    this.modal.create('termsModal', 'content').open()
  }

}
