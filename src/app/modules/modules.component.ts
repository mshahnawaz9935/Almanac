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
  list = ['random-img-01.jpg','random-img-02.jpg','random-img-03.jpg','random-img-04.jpg','random-img-05.jpg','random-img-06.jpg','random-img-07.jpg','random-img-08.jpg','random-img-09.jpg','random-img-10.jpg'];
  error : Boolean;
  authenticated1;
  constructor(private http:Http , private DataService:DataService ,private router: Router) { 
      window.scrollTo(0,0);
      this.loading = true;               // Spinner 
      console.log("Menu bar Data Service login", this.DataService.authenticated1);            
      this.http.get('https://student.almanac-learning.com/onenote/checklogin')               
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
                this.generateimages();
          if(dataFromServer == 'No Login')         // No Login
          {
            console.log('Not logged in');
            this.authenticated1 = false;
            this.loading = false;
            this.subscription = 'Please Login to view the collections';
          }
          else if(dataFromServer == 'Logged in via database')       // Check Login via DB
          {
          this.DataService.dblogin = true;
          this.authenticated1 = true;
           console.log('Logged in via database');
            this.http.get('https://student.almanac-learning.com/api/subscription')
              .map((res: Response) => res.json()). 

              subscribe((dataFromServer) => {       // Get username
                console.log('Subscription status is ' + dataFromServer );
                this.user = dataFromServer.name;

              })
                setTimeout(()=> { 
             this.http.get('https://student.almanac-learning.com/api/instances?id=db')
              .map((res: Response) => res.json())
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Collections Subscribed';
             this.exists = true; 
             this.loading = false;
              
           }
             else if(dataFromServer == '500 Occured' )                // Internal Server Error Occured
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
            }, 800);
      }
          else
          { this.authenticated1 =true;
          console.log('Logged in' ,this.authenticated1);


      this.http.get('https://student.almanac-learning.com/onenote/aboutme')             // Check Login via Office365
              .map((res: Response) => res.json()).subscribe((Serverdata) => {
                console.log('Login status is ' + Serverdata );
                this.user = Serverdata;

                   });
                         setTimeout(()=> {  
                 this.http.get('https://student.almanac-learning.com/api/instances?id=modules')
              .map((res: Response) => res.json())
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer + this.exists );
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Collections Subscribed';
             this.exists = true;
             this.loading = false;
              
           }
             else if(dataFromServer == '500 Occured')
           {
               this.subscription = 'Internal Server Occured. Refresh Again';
               this.loading = false;
             this.getInstances();
           }
           else 
           {
             this.getdata(dataFromServer);
             this.data = dataFromServer;
             this.exists = false;
             this.loading = false;
             this.subscription = 'View your subscribed collections below';
              
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
  onclick(moduleid, modulename){                             // Select a Module
    console.log(moduleid, modulename, 'Module clicked');
    this.DataService.moduleid = moduleid;
    this.DataService.modulename = modulename;
    this.router.navigate(['/search']);
    
  }
  image_list = [];
      generateimages()
      {
        for(let image of this.list) {
          image = 'assets//img//almanac//cards//random-imgs//' + image;
          this.image_list.push(image);
        }
        console.log(this.image_list);
      }

      getInstances() {                                // Get Modules again if Internal Server occurs

        console.log('on error');
           this.http.get('https://student.almanac-learning.com/api/instances?id=modulesonerror')
              .map((res: Response) => res.json())
              .subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer + this.exists );
           
           if(dataFromServer == 'Subscription does not exists')  {
             this.loading = false;
             this.subscription = 'No Collections Subscribed';
             this.exists = true;  
           }
            else if(dataFromServer == '500 Occured')  {
               this.subscription = 'Internal Server Occured. Refresh Again';
               this.loading = false;
                this.exists = false;  
             }
           else {
             this.data = dataFromServer;
             this.exists = false;
             this.loading = false;
             this.subscription = 'View your subscribed collections below';
              this.getdata(dataFromServer);
               }
        }
        
        )}

}
