import { Component, OnInit, ViewChild } from '@angular/core';
import { DbService, AuthService } from '../../shared/services';
import { v4 as uuid } from 'uuid'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-fortnox',
  templateUrl: './fortnox.component.html',
  styleUrls: ['./fortnox.component.scss']
})
export class FortnoxComponent implements OnInit {

  @ViewChild('igrid', { static: false}) igrid

  authorizationCode = ''

  dataSource: any = {}

  constructor(private db: DbService, private auth: AuthService, private http: HttpClient) {

    this.db.createDataSource(this.auth.system, 'fortnoxintegrations', this.dataSource)

  }

  ngOnInit() {
  }

  authorize() {
    
    console.log(this.authorizationCode)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa('web:web')
      })
    }

    this.http.get(`https://api.bokad.se:4433/fortnox/getaccesstoken?system=${this.auth.system}&authorizationcode=${this.authorizationCode}`, httpOptions).toPromise().then((result: any) => {
      console.log('--> authorize', result)
      this.igrid.instance.refresh()
    })

  }

}
