import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../interfaces/product'

@Pipe({
  name: 'itemQuantity'
})
export class ItemQuantityPipe implements PipeTransform {

  transform(product: Product, selectedItems: any[], pipeHelper: number): number {
    return selectedItems.filter(si => si.idProduct == product.id).reduce((acc, si) => acc += si.quantity, 0)
  }

}
