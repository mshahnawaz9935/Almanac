import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  
  data=[];
  exists = false;
  user ='User';
  loading: Boolean;
  subscription = '';
  error : Boolean;
  authenticated1;
  constructor(private http:Http , private DataService:DataService ,private router: Router) { 
    this.loading = true;
           console.log("Menu bar Data Service login", this.DataService.authenticated1);
       this.http.get('https://student.almanac-learning.com/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          {
            console.log('Not logged in');
          this.authenticated1 = false;
          this.loading = false;
          this.subscription = 'Please Login to view the collections';
        }
         else if(dataFromServer == 'Logged in via database')
        {
          this.authenticated1 =true;
           console.log('Logged in via database');
            this.http.get('https://student.almanac-learning.com/api/subscription')
              .map((res: Response) => res.json()). 

              subscribe((dataFromServer) => {
                console.log('Subscription status is ' + dataFromServer );
                this.user = dataFromServer.name;

              })

             this.http.get('https://student.almanac-learning.com/api/instances?id=menu')
              .map((res: Response) => res.json())
              // .catch((error:any) => 
              //           {
              //               console.log('Error instances is ', error);
              //               if(error.status == '500')
              //               {
              //               console.log('500 occured', error.status);
              //               this.getInstances();
              //               }
              //             return Observable.throw(error.json().error || 'Server error') 
              //            })
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Collections Subscribed';
             this.exists = false;
             this.loading = false;
              
           }
             else if(dataFromServer == '500 Occured' )
           {
             this.loading = false;
             this.subscription = 'Internal Server Error Occured';
             this.getInstances();
           }
           else 
           {
               this.data = dataFromServer;
             this.exists = false;
             this.loading = false;
             this.subscription = 'View your subscribed collections below';
              this.getdata(dataFromServer);
           }
        }
        
        
        );

        }
          else
          { this.authenticated1 =true;
          console.log('Logged in' ,this.authenticated1);


      this.http.get('https://student.almanac-learning.com/onenote/aboutme')
              .map((res: Response) => res.json()).subscribe((Serverdata) => {
                console.log('Login status is ' + Serverdata );
                this.user = Serverdata;

                   });
                         setTimeout(()=> {  
                 this.http.get('https://student.almanac-learning.com/api/instances?id=modules')
              .map((res: Response) => res.json())
              // .catch((error:any) => 
              //           {
              //               console.log('Error instances is ', error);
              //               if(error.status == '500')
              //               {
              //               console.log('500 occured', error.status);
              //               this.getInstances();
              //               }
              //             return Observable.throw(error.json().error || 'Server error') 
              //            })
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Collections Subscribed';
             this.exists = false;
             this.loading = false;
              
           }
             else if(dataFromServer == '500 Occured')
           {
               this.subscription = '<h3>Internal Server Occured. Refresh Again<h3>';
               this.loading = false;
             this.getInstances();
           }
           else 
           {
               this.data = dataFromServer;
             this.exists = false;
             this.loading = false;
             this.subscription = 'View your subscribed collections below';
              this.getdata(dataFromServer);
           }
        }
        
        
        );
         }, 800);
           
          }
        });
     


            
   
      
  }
  
  ngOnInit() {
      
  }
    getdata(data){
    console.log('get ',data);
    if(data != null)
    {
      for(let desc of data)
      {
        console.log(desc.name);
      }
    }
  }
  onclick(moduleid, modulename){
    console.log(moduleid, modulename, 'Module clicked');
    this.DataService.moduleid = moduleid;
    this.DataService.modulename = modulename;
    this.router.navigate(['/search']);
    
  }

      getInstances() {

        console.log('on error');
           this.http.get('https://student.almanac-learning.com/api/instances?id=modulesonerror')
              .map((res: Response) => res.json())
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.loading = false;
             this.subscription = 'No Modules Subscribed';
             this.exists = false;
             
           }
            else if(dataFromServer == '500 Occured')
           {
               this.subscription = '<h3>Internal Server Occured. Refresh Again<h3>';
               this.loading = false;
           }
           else 
           {
             this.exists = true;
             this.subscription = 'View your subscribed modules below';
              this.getdata(dataFromServer);
               this.loading = false;
           }
        }
        
        
        );

     }

}
