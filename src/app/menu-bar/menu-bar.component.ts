import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
authenticated1 = false;
user = '';
subscription;
exists = false;

   constructor(private location: Location , private http:Http, private DataService: DataService, private router:Router)  {

           console.log("Menu bar Data Service login", this.DataService.authenticated1);
       this.http.get('https://student.almanac-learning.com//onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          {
            console.log('Not logged in');
          this.authenticated1 = false;
        }
        else if(dataFromServer == 'Logged in via database')
        {
          this.authenticated1 =true;
           console.log('Logged in via database');
           this.http.get('https://student.almanac-learning.com//api/subscription')
              .map((res: Response) => res.json()). 

              subscribe((dataFromServer) => {
                console.log('Subscription status is ' + dataFromServer );
                this.user = dataFromServer.name;

              })


             this.http.get('https://student.almanac-learning.com//api/instances?id=db')
              .map((res: Response) => res.json())
              .catch((error:any) => 
                        {
                            console.log('Error instances is ', error);
                            if(error.status == '500')
                            {
                            console.log('500 occured', error.status);
                            this.getInstances();
                            }
                          return Observable.throw(error.json().error || 'Server error') 
                         })
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Modules Subscribed';
             this.exists = false;
           }
           else if(dataFromServer == '500 Occured')
           {
             this.exists = false;
             this.getInstances();
           }
           else 
           {
             this.exists = true;
             this.subscription = 'View your subscribed modules below';
              this.getdata(dataFromServer);
           }
        }
        
        
        );

        }
          else
          { this.authenticated1 =true;
          console.log('Logged in' ,this.authenticated1);

         
          this.http.get('https://student.almanac-learning.com//onenote/aboutme')
              .map((res: Response) => res.json()). 

              subscribe((dataFromServer) => {
                console.log('Login status is ' + dataFromServer );
                this.user = dataFromServer;

              })

              setTimeout( () => {
               this.http.get('https://student.almanac-learning.com//api/instances?id=menu')
              .map((res: Response) => res.json())
              .catch((error:any) => 
                        {
                            console.log('Error instances is ', error);
                            if(error.status == '500')
                            {
                            console.log('500 occured', error.status);
                            this.getInstances();
                            }
                          return Observable.throw(error.json().error || 'Server error') 
                         })
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Modules Subscribed';
             this.exists = false;
           }
           else if(dataFromServer == '500 Occured')
           {
                this.exists = false;
             this.getInstances();
           }
           else 
           {
             this.exists = true;
             this.subscription = 'View your subscribed modules below';
              this.getdata(dataFromServer);
           }
        }
        
        
        );
              }, 800 );
          

          }
        });
         this.http.get('https://student.almanac-learning.com//api/token')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
               dataFromServer
              );
        setInterval(()=>{

           this.http.get('https://student.almanac-learning.com//api/token')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
               dataFromServer
              );

        },150000);

        



   }
list=[];
moduledata;
  back() {
      console.log('back');
      this.location.back(); // <-- go back to previous location on cancel
    }
   getdata(data)
   {
     this.list = [];
        console.log('Modules data is' , data);
        this.moduledata = data;

        data.forEach(element => {
          console.log(element.name);
          this.list.push(element.name);
        });
   }

  ngOnInit() {
  }
  onEnter(value)
  {
    this.router.navigate(['/search']);
    value='';
  }
    onclick(moduleid, modulename){
    console.log(moduleid, modulename, 'Module clicked');
    this.DataService.moduleid = moduleid;
    this.DataService.modulename = modulename;
       this.http.get('https://student.almanac-learning.com//api/instances')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {   // View instances
                console.log('Login status is ' + dataFromServer );
                this.getsliders(dataFromServer);
                this.router.navigate(['/search']);
              });

    
  }

    getsliders(data)
  {
    console.log(data);
    for(let module of data)
    {
      if(this.DataService.moduleid == module.id)
      {
        console.log('module found');
        //this.differentiator = module.differentiators;
       // this.type= module.type;
             this.DataService.differentiator = module.differentiators;
       this.DataService.type= module.type;
      }
      
      
    }

  }

    getInstances() {

      console.log('on error');
           this.http.get('https://student.almanac-learning.com//api/instances?id=menuerror')
              .map((res: Response) => res.json())
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Modules Subscribed';
             this.exists = false;
           }
             else if(dataFromServer == '500 Occured')
           {
                this.exists = false;
           }
           else 
           {
             this.exists = true;
             this.subscription = 'View your subscribed modules below';
              this.getdata(dataFromServer);
           }
        }
        
        
        );

     }

}
