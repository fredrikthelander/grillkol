import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../../interfaces/order'
import { Project } from '../../interfaces/project'

@Pipe({
  name: 'orderFilter'
})
export class OrderFilterPipe implements PipeTransform {

  transform(orders: Order[], project: Project): Order[] {
    return orders.filter(o => o.project.id == project.id)
  }

}
