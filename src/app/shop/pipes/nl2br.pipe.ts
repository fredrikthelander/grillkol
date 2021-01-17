import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2br'
})
export class Nl2brPipe implements PipeTransform {

  transform(s: string): string {
    console.log(22, s.replace(/\n/g, "<br>\n"))
    return s.replace(/\n/g, "<br>\n")
  }

}
