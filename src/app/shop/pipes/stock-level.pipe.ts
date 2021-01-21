import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockLevel'
})
export class StockLevelPipe implements PipeTransform {

  transform(stocklevel: number): string {

    let s

    switch (true) {

      case (stocklevel < 1):
        s = 'Ej i lager'
        break

      case (stocklevel > 500):
        s = 'Lager > 500'
        break

      default:
        s = `Lager: ${stocklevel}`

    }

    return s

  }

}
