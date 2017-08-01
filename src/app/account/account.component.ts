import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { DataService } from '../DataService';
import { Login } from './login';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})




  export class AccountComponent implements OnInit {
    
    model = new Login('', '');
  submitted = false;
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
       window.open('https://student.almanac-learning.com/onenote','_self' );
    }
    create()
    {
      alert('Functionality no longer supported. Login using Office 365');
    }
    login()
    {
       
        this.http.get('https://student.almanac-learning.com/onenote/userlogin?username=shahnawaz1234&password=123456789')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
                 { console.log(dataFromServer);
                   if(dataFromServer == 'User exists')
                    this.router.navigate(['/modules']);
                 }
              );
    }
    onSubmit() 
      { 
        this.submitted = true;
        console.log(this.model.username + '  ' +  this.model.password);
        
           this.http.get('https://student.almanac-learning.com/onenote/userlogin?username=' + this.model.username+ '&password=' + this.model.password)
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
                 { console.log(dataFromServer);
                   if(dataFromServer == 'User exists')
                    window.location.replace('/modules');
                    else alert('Invalid Credentials');
                 }
              );
  
      
    }
 
}
