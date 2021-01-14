import { Component, OnInit } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import { SwishCert } from '../../interfaces/swish-cert'

@Component({
  selector: 'app-swish',
  templateUrl: './swish.component.html',
  styleUrls: ['./swish.component.scss']
})
export class SwishComponent implements OnInit {

  dataSource: any = {}

  constructor(public db: DbService, private auth: AuthService) {

    this.db.createDataSource(this.auth.system, 'swishcerts', this.dataSource)

  }

  ngOnInit() {
  }


  initCert(swishCert: SwishCert) {
    
    swishCert.id = uuid()
    swishCert.swishnumber = '123'
    swishCert.privateKey = ''
    swishCert.swishCrt = ''
    swishCert.active = true
    swishCert.ftg = ''
    swishCert.adr1 = ''
    swishCert.adr2 = ''
    swishCert.orgnr = ''
    swishCert.tel = ''
    swishCert.terms = ''
    swishCert.sortorder = 10

  }

}
