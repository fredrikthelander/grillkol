import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import { Vat } from '../../interfaces/vat'

@Component({
  selector: 'app-vats',
  templateUrl: './vats.component.html',
  styleUrls: ['./vats.component.scss']
})
export class VatsComponent implements OnInit {

  dataSource: any = {}
  
  constructor(private db: DbService, private auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'vats', this.dataSource)

    //this.onReorder = this.onReorder.bind(this);

  }

  ngOnInit() {
  }

  initVat(v: Vat) {

    let vat: Vat = {
      id: uuid(),
      name: '',
      vatPercent: 0,
      default: false,
      sortorder: 10,
      active: true
    }

    Object.entries(vat).forEach(([key, value]) => {
      v[key] = value
    })

  }

  //onReorder(e) {
  //  e.promise = this.processReorder(e);
  //}
//
  //async processReorder(e) {
//
  //  let visibleRows = e.component.getVisibleRows()
  //  //let toOrderIndex = visibleRows[e.toIndex].data.sortorder;
  //  //let fromOrderIndex = visibleRows[e.fromIndex].data.sortorder;
  //  let newOrderIndex = visibleRows[e.toIndex].data.sortorder + 0.0001;
  //  console.log(2, newOrderIndex)
  //  console.log(3, e)
  //  //await e.component.cellValue(e.toIndex, 'sortorder', fromOrderIndex)
  //  //await e.component.cellValue(e.fromIndex, 'sortorder', toOrderIndex)
  //  //await this.dataSource.update(e.itemData.id, { sortorder: newOrderIndex });
  //  let rowIndex = e.component.getRowIndexByKey(e.itemData.id)
  //  e.component.cellValue(rowIndex, 'sortorder', newOrderIndex)
  //  await e.component.saveEditData()
  //  await e.component.refresh();
  //  console.log('done')
  //}

}
