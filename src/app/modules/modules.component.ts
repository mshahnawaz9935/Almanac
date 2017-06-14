import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { Router} from '@angular/router';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  
  data=[];
  exists = false;
  user ='Welcome';
  constructor(private http:Http , private DataService:DataService ,private router: Router) { 
      
  }
  subscription = '';
  ngOnInit() {

      this.http.get('https://angular2ap.azurewebsites.net/onenote/aboutme')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {
                console.log('Login status is ' + dataFromServer );
                this.user = dataFromServer;
              });

    this.http.get('https://angular2ap.azurewebsites.net/api/instances')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Module status is ' + dataFromServer );
           
           if(dataFromServer == 'Subscription does not exists')
           {
             this.subscription = 'Subscription does not exists. Buy a product First';
             this.exists = true;

           }
           else 
           {
              this.data = dataFromServer;
             this.exists = false;
             this.subscription = 'View your subscribed modules below';
              this.getdata(dataFromServer);
           }
        });
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

}
