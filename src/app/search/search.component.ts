import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRoute }     from '@angular/router';
import { Search }    from './Search';
import { NouisliderModule } from 'ng2-nouislider';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent implements OnInit {
    model = new Search('', 4, 10);
  submitted = false;
value=''; data=[];
results;username='';password='';
authenticated = false;
authenticated1= false;
user='';
instances='';
differentiator1={};
differentiator2={};
  constructor(private http:Http , private DataService: DataService,private router: Router, private route: ActivatedRoute) {
       route.queryParams.subscribe(
      data =>{ 
        console.log('queryParams', data['authenticated']) ;
        if(data['authenticated']== 'true')
        this.authenticated = true;
    });
     this.http.get('http://localhost:3000/note/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          this.authenticated = false;
          else this.authenticated =true;
          console.log(this.authenticated);
        });
        this.http.get('http://localhost:3000/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          {
          this.authenticated1 = false;
         // this.router.navigate(['/account']);
          }
          else
          { this.authenticated1 =true;
          console.log(this.authenticated1);

          this.http.get('http://localhost:3000/onenote/aboutme')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {
                console.log('Login status is ' + dataFromServer );
                this.user = dataFromServer;
              });
          }
        });
        this.http.get('http://localhost:3000/api/instances')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {
                console.log('Login status is ' + dataFromServer );
                this.instances = dataFromServer;
              });
         
   }

  ngOnInit() {
 
  }
    error:boolean = false;
  onSubmit()
  {
    this.submitted = true;
    console.log('hello', this.model.search.length , this.model.slider_value1, this.model.slider_value2);
    if(this.model.search != '')
    {
    this.http.get('http://localhost:3000/api/search?id='+ this.model.search)
        .map((res: Response) => res.json())
        .subscribe((dataFromServer) => {
          this.data = dataFromServer;
          this.getdata(dataFromServer);
          console.log('Data from postman is ' + this.data);
        });
    }
  }

  getdata(data){
    console.log('get ',data);
    if(data.results != null)
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

    note()
  {
       console.log('Authenticated');
       window.open('http://localhost:3000/note','_self' );
   
  }

  onenote()
  {
       console.log('Authenticated');
       window.open('http://localhost:3000/onenote','_self' );
   
  }
   onenotelogout()
  {
       window.open('http://localhost:3000/onenote/disconnect','_self' );
   
  }
     logout()
  {
       window.open('http://localhost:3000/note/logout','_self' );
   
  }

    onSelect(data): void {
      console.log('clicked query' + data.name + data.query);
      this.DataService.myquery.topic = data.query;
      this.DataService.myquery.chapter = data.name;
      this.router.navigate(['./posts']);
       
  }
}
