import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
  export class AccountComponent implements OnInit {
  authenticated1 = false;
  user = '';
  constructor(private http:Http) {}

  ngOnInit() {}

  onenote() 
  {
       console.log('Authenticated');
       window.open('http://localhost:3000/onenote','_self' );
    }
    create()
    {
      alert('Functionality no longer supported. Login using Office 365');
    }
 
}
