import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../interfaces/product'

@Pipe({
  name: 'catPipe'
})
export class CatPipePipe implements PipeTransform {

  transform(products: Product[], idCategory: string): Product[] {
    return products.filter(p => p.idCategory == idCategory)
  }

}
