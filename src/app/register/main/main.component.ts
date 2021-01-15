import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  vars = {
    name: '',
    persons: null,
    contactName: '',
    email: '',
    phone: '',
    catalogs: false,
    newsletter: false
  }

  constructor() { }

  ngOnInit() {
  }
  
  onSubmit(e) {
    
  }

  catalogClick(e) {
    console.log(e)
  }

}
