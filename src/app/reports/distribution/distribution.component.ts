import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService, DbService, MsgBusService } from '../../shared/services';
import { Project } from '../../interfaces/project'
import { Order } from '../../interfaces/order'
import { SalesPerson } from '../../interfaces/sales-person'
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent implements OnInit {

  //projects: Project[] = []
  project: Project
  orders: Order[] = []  
  salesPersons: SalesPerson[] = []
  distribution = []

  constructor(public auth: AuthService, private db: DbService) {

    pdfMake.vfs = pdfFonts.pdfMake.vfs

  }

  ngOnInit() {
  }

  async setup() {

    this.orders = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'orders', token: this.db.token, condition: { "project.id": this.project.id }, sort: { } })
    this.salesPersons = await <any>this.db.sendMessagePromiseData('mget', { system: this.auth.system, table: 'salespersons', token: this.db.token, condition: { owner: this.project.email }, sort: { } })

    this.distribution = []
    

      this.orders.filter(order => order.project.id == this.project.id).forEach(order => {

        let d = this.distribution.find(d => d.idSalesPerson == order.salesPerson.id)

        if (d) {
          d.totalIncl += order.totalIncl
          d.orders.push(this.stripOrder(order))
          d.orderCount++
        } else {
          this.distribution.push({ idSalesPerson: order.salesPerson.id, code: '', name: '', totalIncl: order.totalIncl, percentage: 0, orderCount: 1, orders: [this.stripOrder(order)] })
        }

      })

      this.salesPersons.forEach(salesPerson => {

        let d = this.distribution.find(d => d.idSalesPerson == salesPerson.id)

        if (d) {
          d.name = salesPerson.name
          d.code = salesPerson.code
        } else {
          this.distribution.push({ idSalesPerson: salesPerson.id, name: salesPerson.name, totalIncl: 0, percentage: 0, orderCount: 0, orders: [] })
        }

      })

      let total = this.distribution.reduce((ack, d) =>  ack += d.totalIncl, 0)

      this.distribution.forEach(d => {
        if (d.totalIncl) d.percentage = Math.round(d.totalIncl / total * 10000) / 100
      })


  }

  stripOrder(order: Order): any {
    
    let so: any = {}

    so.orderid = order.orderid
    so.fnamn = order.fnamn
    so.enamn = order.enamn
    so.total = 0
    so.items = []

    order.items.forEach(oi => {
      
      so.items.push({
        product:{ id: oi.product.id, sku: oi.product.sku, name: oi.product.name, priceIncl: oi.product.priceIncl },
        quantity: oi.quantity,
        total: oi.total
      })

      so.total += oi.total

    })

    return so

  }

  projectChanged(project) {
    this.project = project
    this.setup().then((result) => {}).catch((err) => {}) 
  }

  showReport = (e) => {
    console.log(e)
    if (this.project) window.open(`/rapport/${this.project.code}/${e.row.data.code}`, "_blank");
  }

  async pdfReport1() {

    console.log(1)

    let content: any = [ { text: `Orderlista ${this.project.name}\n\n`, fontSize: 16, bold: true } ]
    // { text: `Orderlista ${this.project.name}\n\n`, fontSize: 16, bold: true }

    this.distribution.sort((a, b) => { if (a.name < b.name) return -1; if (a.name > b.name) return 1; return 0; }).forEach(salesPerson => {

      let salesPersonItems = []
      
      content.push({ text: `Säljare: ${salesPerson.name}`, fontSize: 14, bold: true, margin: [0, 10, 0, 10], pageBreak: 'before' })

      salesPerson.orders.forEach(order => {

        content.push({ text: `Ordernummer: ${order.orderid}, ${order.fnamn} ${order.enamn}`, fontSize: 12, bold: true, margin: [10,10,10,10] })

        let items = []
        items.push([
          //{ text: 'Produktnummer', alignment: 'left' }, 
          { text: 'Produkt', alignment: 'left' }, 
          { text: 'Antal', alignment: 'right' }, 
          { text: 'À-pris', alignment: 'right' }, 
          { text: 'Summa', alignment: 'right' }
        ])

        order.items.forEach(item => {

          items.push([
            //{ text: item.product.sku, alignment: 'left' }, 
            { text: item.product.name, alignment: 'left' }, 
            { text: item.product.priceIncl.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), alignment: 'right' }, 
            { text: item.quantity.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), alignment: 'right' }, 
            { text: item.total.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), alignment: 'right' }
          ])

          let spi = salesPersonItems.find(spi => spi.product.id == item.product.id)
          if (spi) {
            spi.quantity += item.quantity
          } else {
            salesPersonItems.push({ product: item.product, quantity: item.quantity })
          }

        })

        items.push([
          { text: 'Summa', alignment: 'left' }, 
          //{ text: '', alignment: 'left' }, 
          { text: '', alignment: 'right' }, 
          { text: '', alignment: 'right' }, 
          { text: order.total.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), alignment: 'right', bold: true }
        ])

        content.push({ table: { widths: [250, 50, 50, 50], body: items }, margin: [10,0,0,0] })

      })

      content.push({ text: `Produktsammanställning:`, fontSize: 12, bold: true, margin: [10,10,10,10] })

      let spiItems = []
      spiItems.push([
        { text: 'Produkt', alignment: 'left', bold: true }, 
        { text: 'Antal', alignment: 'right', bold: true }
      ])
      salesPersonItems.sort((a, b) => { if (a.quantity > b.quantity) return -1; if (a.quantity < b.quantity) return 1; return 0; }).forEach(spi => {
        spiItems.push([
          { text: spi.product.name, alignment: 'left' }, 
          { text: spi.quantity.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), alignment: 'right', bold: true }
        ])
      })  

      content.push({ table: { widths: [250, 50], body: spiItems }, margin: [10,0,0,0] })


    })

    var dd = {
      footer: function (currentPage, pageCount) { return { text: 'Skapad ' + moment().format("YYYY-MM-DD HH:mm:ss") + '. Sida ' + currentPage.toString() + ' av ' + pageCount, margin: [ 20, 20, 20, 20 ], alignment: 'right', fontSize: 9 } },
      //header: { text: `Orderlista\n`, fontSize: 18, margin: [ 20, 20, 20, 20 ] },
      pageOrientation: 'portrait',
      content: content,
      defaultStyle: {
        fontSize: 10
      }
    }

    pdfMake.createPdf(dd).open()

  }

}
