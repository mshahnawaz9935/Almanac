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
differentiator = [{name:'', levels:[]}];
  type={name:'', levels:[]};
    constructor(private http: Http) {

        this.http.get('https://angular2ap.azurewebsites.net/api/token')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
               dataFromServer
              );

    this.http.get('https://angular2ap.azurewebsites.net/onenote/checklogin')
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

text= 'menu';
    getInstances() {

         // ...using get request
         return this.http.get('https://angular2ap.azurewebsites.net/api/instances?id='+this.text )
                        // ...and calling .json() on the response to return data
                         .map((res:Response) => res.json())
                         //...errors if any
                         .catch((error:any) => 
                         {
                            console.log('Error instances is ', error);
                            if(error.status == '500')
                            {
                            console.log('500 occured', error.status);
                           // this.getInstances();
                            }
                          return Observable.throw(error.json().error || 'Server error') 
                         });

     }
    



}