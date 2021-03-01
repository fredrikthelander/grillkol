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

    const palletVolume = 2112000 

    orders.filter(o => o.project.id == project.id).forEach(o => {
      
      total += o.totalIncl
      count++

      o.items.forEach(oi => {
        totalVolume += oi.product.volume * oi.quantity
        resellerCost += oi.product.resellerPriceIncl * oi.quantity
      })

    })

    serviceFee = total * project.serviceRate / 100 || 0

    if (totalVolume <= 3 * palletVolume) deliveryFee = 1950
    if (totalVolume <= 1 * palletVolume) deliveryFee = 1150

    if (project.catalogs) portoFee = 50

    earnings = total - resellerCost - deliveryFee - serviceFee - portoFee

    let pallets = Math.floor(totalVolume / palletVolume * 10) / 10
    
    return { total, count, serviceFee, totalVolume, deliveryFee, earnings, portoFee, pallets }

  }

}
