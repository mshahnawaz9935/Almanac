import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import {Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
value=''; data=[];
results;username='';password='';
  constructor(private http:Http , private DataService: DataService,private router: Router) { }

  ngOnInit() {
  }

    onEnter(value: string) {

    this.value = value;
    this.http.get('http://angular2ap.azurewebsites.net/api/search?id='+ this.value)
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          this.data = dataFromServer;
          this.getdata(dataFromServer);
          console.log('Data from postman is ' + this.data );
        });
     
  }

  getdata(data){
    console.log(data.results.result);
    this.results = data.results.result;

  }

    note()
  {
        window.open('http://www.localhost:3000/note');

  }

    onSelect(data): void {
      console.log('clicked query' + data.name + data.query);
      this.DataService.myquery.topic = data.query;
      this.DataService.myquery.chapter = data.name;
      this.router.navigate(['./posts']);
       
  }
}
