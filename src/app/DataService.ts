import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class DataService {

authenticated1;
myquery = { topic: '' , chapter : '' , articleid : '' };
query = '';
moduleid='';
modulename='';
slider1='';
slider2='';
    constructor(private http: Http) {

        this.http.get('http://localhost:3000/api/token')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
               dataFromServer
              );

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

    getInstances() {

         // ...using get request
         return this.http.get('http://localhost:3000/api/instances')
                        // ...and calling .json() on the response to return data
                         .map((res:Response) => res.json())
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

     }
    



}