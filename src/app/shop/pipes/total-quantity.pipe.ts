import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalQuantity'
})
export class TotalQuantityPipe implements PipeTransform {

  transform(selectedItems: any[], pipeHelper: number): number {
    return selectedItems.reduce((acc, si) => acc += si.quantity, 0)
  }

}
