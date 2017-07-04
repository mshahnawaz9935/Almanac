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
  model = new Search('', 1, 1);
  submitted = false;
  value=''; data=[];
  results;username='';password='';
  authenticated = false;
  authenticated1= false;
  user='';
  differentiator = [{name:'', levels:[]}];
  type={name:'', levels:[]};
  constructor(private http:Http , private DataService: DataService,private router: Router, private route: ActivatedRoute) {
    //    route.queryParams.subscribe(
    //   data =>{ 
    //     console.log('queryParams', data['authenticated']) ;   //Read Query string from Url
    //     if(data['authenticated']== 'true')
    //     this.authenticated = true;
    // });
    console.log(this.DataService.moduleid);
     this.http.get('http://localhost:3000/note/checklogin')               // Check Login
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          this.authenticated = false;
          else this.authenticated =true;
          console.log(this.authenticated);
        });
        this.http.get('http://localhost:3000/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {      //Check if user is logged in
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
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {    // Get User details
                console.log('Login status is ' + dataFromServer );
                this.user = dataFromServer;
              });
          }
        });
       
         
   }

  ngOnInit() {
     if(this.DataService.moduleid != '')
        {
          console.log('Module selected' , this.DataService.moduleid , this.DataService.modulename);
        this.http.get('http://localhost:3000/api/instances')
              .map((res: Response) => res.json()).subscribe((dataFromServer) => {   // View instances
                console.log('Login status is ' + dataFromServer );
                this.getInstance(dataFromServer);

              });
                 
        }
        else
        {  
          this.router.navigate(['/modules']);
        }
 
  }

    error:boolean = false;
    slider1;
    slider2;
  onSubmit()
  {
    this.submitted = true;
    console.log('hello', this.model.search.length , this.model.slider_value1, this.model.slider_value2);
    this.slider1= this.differentiator[0].levels[this.model.slider_value1];
    this.slider2=this.type.levels[this.model.slider_value2];
    console.log('Slider values are' ,this.slider1, this.slider2);
    if(this.model.search != '')
    {
      this.DataService.query = this.model.search;
      this.DataService.slider1 = this.slider1;
      this.DataService.slider2 = this.slider2;
    // this.http.get('http://localhost:3000/api/search?id='+ this.model.search + '&differentiator='+ this.slider1+ '&type=' + this.slider2)     
      // this.http.get('http://localhost:3000/api/search?id='+ this.model.search)
      //   .map((res: Response) => res.json())
      //   .subscribe((dataFromServer) => {
      //     this.data = dataFromServer;
      //   //  this.getdata(dataFromServer);
      //     console.log('Data from postman is ' + this.data);
      //   });
        this.router.navigate(['./results']);
    }
  }

  getInstance(data)
  {
    console.log(data);
    for(let module of data)
    {
      if(this.DataService.moduleid == module.id)
      {
        console.log('module found');
        this.differentiator = module.differentiators;
        this.type= module.type;
      }
      
      
    }

    console.log('difff and type', this.type.name, this.differentiator[0].name, this.type.levels);
  }



  // getdata(data){                      
  //   console.log('get ',data);                    // Substring the text from the obtained data
  //   if(data.results.length >0)
  //   {
  //     this.error = false;
  //     for(let desc of data.results)
  //     {
  //       let len =desc.description.length;
  //       desc.description = desc.description.substring(9,len-3);
  //     }
  //     this.results = data.results;
  //   }
  //     else this.error =true;
  // }

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

  //   onSelect(data): void {
  //     console.log('clicked query' + data.name + data.query);          // Select topic and redirect to the article
  //     this.DataService.myquery.topic = data.query;
  //     this.DataService.myquery.chapter = data.name;
  //     this.router.navigate(['./posts']);
  // }
}
