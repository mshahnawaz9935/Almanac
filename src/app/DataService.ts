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
slider1 : number;
slider2: number;
differentiator = [{name:'', levels:[]}];
  type={name:'', levels:[]};
  key ='';
  dblogin = false;
    constructor(private http: Http) {

      this.http.get('http://localhost:3000/api/saskey')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
              {
                  this.key = dataFromServer;
              }
              );

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

text= 'menu';
    getInstances() {

         // ...using get request
         return this.http.get('http://localhost:3000/api/instances?id='+this.text )
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