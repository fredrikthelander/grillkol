import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalAmount'
})
export class TotalAmountPipe implements PipeTransform {

  transform(selectedItems: any[], pipeHelper: number): number {
    return selectedItems.reduce((acc, si) => acc += si.amount, 0)
  }

}
