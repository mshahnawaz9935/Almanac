import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
value=''; data=[];
results;
  constructor(private http:Http) { }

  ngOnInit() {
  }

    onEnter(value: string) {
    this.value = value;
    this.http.get('http://localhost:3000/api/search?id='+ this.value)
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
}
