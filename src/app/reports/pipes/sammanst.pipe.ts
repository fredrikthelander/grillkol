import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../../interfaces/order'
import { Project } from '../../interfaces/project'

@Pipe({
  name: 'sammanst'
})
export class SammanstPipe implements PipeTransform {

  transform(orders: Order[], project: Project): any {
    
    let total = 0
    let count = 0
    let portoFee = 0
    let serviceFee = 0
    let deliveryFee = 0
    let totalVolume = 0
    let resellerCost = 0
    let earnings = 0
    let h1 = 0; let h2 = 0;
    let hantering = 0

    //const palletVolume = 2112000 // 80 x 120 x 220 
    const palletVolume = 2304000 // 80 x 120 x 240

    orders.filter(o => o.project.id == project.id).forEach(o => {
      
      total += o.totalIncl
      count++

      o.items.forEach(oi => {

        totalVolume += oi.product.volume * oi.quantity
        resellerCost += oi.product.resellerPriceIncl * oi.quantity

        // Hantering Grillkol
        if (oi.product.sku == '347111') h1 += oi.quantity

        // Hantering Briketter
        if (oi.product.sku == '401002') h2 += oi.quantity

      })

    })

    if (h1 / 60 != Math.round(h1 / 60)) hantering = 250
    if (h2 / 95 != Math.round(h2 / 95)) hantering = 250

    serviceFee = total * project.serviceRate / 100 || 0

    if (totalVolume <= 3 * palletVolume) deliveryFee = 1950
    if (totalVolume <= 1 * palletVolume) deliveryFee = 1150

    if (project.catalogs) portoFee = 50

    earnings = total - resellerCost - deliveryFee - serviceFee - portoFee - hantering

    let pallets = Math.floor(totalVolume / palletVolume * 10) / 10
    
    return { total, count, serviceFee, totalVolume, deliveryFee, earnings, portoFee, pallets, hantering }

  }

}
