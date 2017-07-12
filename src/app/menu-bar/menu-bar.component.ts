import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { Router } from '@angular/router';

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

   constructor(private http:Http, private DataService: DataService, private router:Router)  {

           console.log("Menu bar Data Service login", this.DataService.authenticated1);
       this.http.get('http://localhost:3000/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          {
            console.log('Not logged in');
          this.authenticated1 = false;
          }
          else
          { this.authenticated1 =true;
          console.log('Logged in' ,this.authenticated1);

          this.http.get('http://localhost:3000/onenote/aboutme')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {
                console.log('Login status is ' + dataFromServer );
                this.user = dataFromServer;
              });
               this.DataService.getInstances().subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Modules Subscribed';
             this.exists = false;
           }
           else 
           {
             this.exists = true;
             this.subscription = 'View your subscribed modules below';
              this.getdata(dataFromServer);
           }
        });

        setTimeout(()=> {

             this.DataService.getInstances().subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'No Modules Subscribed';
             this.exists = false;
           }
           else 
           {
             this.exists = true;
             this.subscription = 'View your subscribed modules below';
              this.getdata(dataFromServer);
           }
        });


        }, 300);

        


          }
        });
         this.http.get('http://localhost:3000/api/token')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
               dataFromServer
              );
        setInterval(()=>{

           this.http.get('http://localhost:3000/api/token')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => 
               dataFromServer
              );

        },150000);

        



   }
list=[];
   getdata(data)
   {
     this.list = [];
        console.log('Modules data is' , data);
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

}
