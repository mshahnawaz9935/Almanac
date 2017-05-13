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
  constructor(private http:Http) {
      this.http.get('https://angular2ap.azurewebsites.net/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          this.authenticated1 = false;
          else
          { this.authenticated1 =true;
          console.log(this.authenticated1);

          this.http.get('https://angular2ap.azurewebsites.net/onenote/aboutme')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {
                console.log('Login status is ' + dataFromServer );
                this.user = dataFromServer;
              });
          }
        });
   }

  ngOnInit() {
  }

 
}
