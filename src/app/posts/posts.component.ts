import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { DomSanitizer } from '@angular/platform-browser';
import {Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
value='';
data;
img_data = { x : ''};
 data1 = { sections :{section : [ { images : { image :[ {url : 'ssss' }  ] }  }  ]            }     };
  constructor(private http:Http,private DataService: DataService, private sanitizer: DomSanitizer, private router:Router) { 

      this.data = this.DataService.myquery;
      console.log('Data from post api is ' + this.data1.sections.section[0].images );
    this.http.get('http://angular2ap.azurewebsites.net/api/posts?topic='+ this.data.topic + '&chapter='+ this.data.chapter)
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          this.img_data = dataFromServer.sections;
        //  console.log('Data from post api is ' + this.img_data.image[0].url );
      });
  }
  savedata()
  {
        this.http.get('http://angular2ap.azurewebsites.net/api/store')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( dataFromServer);
        });
  }

  savenote()
  {
       window.open('http://angular2ap.azurewebsites.net/note/token','_self');
       alert('Saved to One Note');

  }

  ngOnInit() {
  }

}
