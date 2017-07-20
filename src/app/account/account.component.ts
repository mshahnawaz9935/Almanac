import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { DataService } from '../DataService';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
  export class AccountComponent implements OnInit {
  authenticated1 = false;
  user = '';
  constructor(private http:Http , private router:Router , private DataService:DataService) {
        if(this.DataService.authenticated1 == true)
    {
      this.router.navigate(['/modules']);
    }
  }

  ngOnInit() {}

  onenote() 
  {
       console.log('Authenticated');
       window.open('https://students.almanac-learning.com/onenote','_self' );
    }
    create()
    {
      alert('Functionality no longer supported. Login using Office 365');
    }
    
 
}
