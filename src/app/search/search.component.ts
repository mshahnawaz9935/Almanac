import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import {Router } from '@angular/router';
import { ActivatedRoute }     from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
value=''; data=[];
results;username='';password='';
authenticated = false;
authenticated1= false;
user='';
  constructor(private http:Http , private DataService: DataService,private router: Router, private route: ActivatedRoute) {
       route.queryParams.subscribe(
      data =>{ 
        console.log('queryParams', data['authenticated']) ;
        if(data['authenticated']== 'true')
        this.authenticated = true;
    });
     this.http.get('https://angular2ap.azurewebsites.net/note/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          this.authenticated = false;
          else this.authenticated =true;
          console.log(this.authenticated);
        });
        this.http.get('https://angular2ap.azurewebsites.net/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          this.authenticated1 = false;
          else
          { this.authenticated1 =true;
          console.log(this.authenticated1);

          this.http.get('https://angular2ap.azurewebsites.net/onenote/aboutme')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {
                console.log('Login status is ' + dataFromServer );
                this.user = dataFromServer;
              });
          }
        });
         
   }

  ngOnInit() {
  }

    onEnter(value: string) {

    this.value = value;
    this.http.get('https://angular2ap.azurewebsites.net/api/search?id='+ this.value)
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          this.data = dataFromServer;
          this.getdata(dataFromServer);
          console.log('Data from postman is ' + this.data );
        });
        
     
  }

  getdata(data){
    console.log('get ',data.results.result);
    for(let desc of data.results.result)
    {
      let len =desc.description.length;
      desc.description = desc.description.substring(9,len-3);
    }
    this.results = data.results.result;

  }

    note()
  {
       console.log('Authenticated');
       window.open('https://angular2ap.azurewebsites.net/note','_self' );
   
  }
  onenote()
  {
       console.log('Authenticated');
       window.open('https://angular2ap.azurewebsites.net/onenote','_self' );
   
  }
   onenotelogout()
  {
       window.open('https://angular2ap.azurewebsites.net/onenote/disconnect','_self' );
   
  }
     logout()
  {
       window.open('https://angular2ap.azurewebsites.net/note/logout','_self' );
   
  }

    onSelect(data): void {
      console.log('clicked query' + data.name + data.query);
      this.DataService.myquery.topic = data.query;
      this.DataService.myquery.chapter = data.name;
      this.router.navigate(['./posts']);
       
  }
}
