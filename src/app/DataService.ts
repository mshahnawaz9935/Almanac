import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class DataService {

authenticated1;
myquery = { topic: '' , chapter : '' };
moduleid='';
    constructor(private http: Http) {

    this.http.get('http://localhost:3000/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Data Service Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          {
          this.authenticated1 = false;
          }
          else
          { this.authenticated1 =true;
          console.log(this.authenticated1);
        }
        });
        
    }
    



}