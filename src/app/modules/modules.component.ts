import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import {Modules} from './Modules';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {

  model = new Modules(0,'Geography');
  
  data=[];
  constructor(private http:Http) { 
      this.http.get('http://localhost:3000/api/instances')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
           this.data = dataFromServer;
           this.getdata(dataFromServer);
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
  onclick(){
    console.log('Module clicked');
  }

}
