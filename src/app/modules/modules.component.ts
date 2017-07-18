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
  user ='Welcome';
  loading: Boolean;
  subscription = '';
  constructor(private http:Http , private DataService:DataService ,private router: Router) { 
    this.loading = true;
      this.http.get('http://angular2ap-testing.azurewebsites.net/onenote/aboutme')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {
                console.log('Login status is ' + dataFromServer );
                this.user = dataFromServer;
                
       //       this.DataService.getInstances().subscribe((dataFromServer) => {
          this.http.get('http://angular2ap-testing.azurewebsites.net/api/instances?id=modules')
              .map((res: Response) => res.json())
              .catch((error:any) => 
                        {
                            console.log('Error instances is ', error);
                            if(error.status == '500')
                            {
                              this.loading = true;
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
                  this.loading = false;

           }
           else 
           {
               this.data = dataFromServer;
             this.exists = false;
             this.subscription = 'View your subscribed modules below';
              this.getdata(dataFromServer);
                     this.loading = false;
           }
        }
        
        
        );

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

           this.http.get('http://angular2ap-testing.azurewebsites.net/api/instances?id=modules')
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
             this.loading = false;
             this.subscription = 'No Modules Subscribed';
             this.exists = false;
             
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
