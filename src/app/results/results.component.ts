import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService';
import { CanActivate, Router } from '@angular/router';
import { Http ,Response} from '@angular/http'; 

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  loading: Boolean;
  error = false;
  results;
  data = [];
  constructor(private http:Http , private DataService: DataService,private router: Router) { }

  ngOnInit() {

    this.loading = true;

    if(this.DataService.query != '')
    {
    // this.http.get('http://localhost:3000/api/search?id='+ this.model.search + '&differentiator='+ this.slider1+ '&type=' + this.slider2)     
      this.http.get('http://localhost:3000/api/search?id='+ this.DataService.query + '&moduleid=' + this.DataService.moduleid)
        .map((res: Response) => res.json())
        .subscribe((dataFromServer) => {
          this.data = dataFromServer;
          this.loading = false;
          this.getdata(dataFromServer);
          console.log('Data from postman is ' + this.data);
        });
    }
    else
    {
      this.router.navigate(['./search']);
    }
  }


  getdata(data){                      
    console.log('get ',data);                    // Substring the text from the obtained data
    if(data.results.length >0)
    {
      this.error = false;
      for(let desc of data.results)
      {
        let len =desc.description.length;
        desc.description = desc.description.substring(9,len-3);
      }
      this.results = data.results;
    }
      else this.error =true;
  }

   onSelect(data): void {
      console.log('clicked query' + data.name + data.query);          // Select topic and redirect to the article
      this.DataService.myquery.topic = data.query;
      this.DataService.myquery.chapter = data.name;
      this.DataService.myquery.articleid = data.id;
      this.router.navigate(['./posts']);
  }

}
