import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import { Category } from '../../interfaces/category'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  dataSource: any = {}

  constructor(private db: DbService, private auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'categories', this.dataSource)

  }

  ngOnInit() {
  }

  initCategory(c: Category) {

    let cat: Category = {
      id: uuid(),
      name: '',
      sortorder: 10,
      active: true
    }

    Object.entries(cat).forEach(([key, value]) => {
      c[key] = value
    })

  }

}
