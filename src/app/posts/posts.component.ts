import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { DomSanitizer } from '@angular/platform-browser';
import {Router } from '@angular/router';
import {Image} from '../image.interface';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

      private NextPhotoInterval:number = 3000;
      private NextPhotoInterval2:number = 100;
    //Looping or not
    private noLoopSlides:boolean = false;
      private noLoopSlides2:boolean = true;
    value='';
    data;
    img_data = { x : ''};
    videoarray = [{url:'https://www.youtube.com/embed/tpYUAlZ64mE'},{url:'https://www.youtube.com/embed/tpYUAlZ64mE'}];

  constructor(private http:Http,private DataService: DataService, private sanitizer: DomSanitizer, private router:Router) { 

      this.data = this.DataService.myquery;
    //this.http.get('https://angular2ap.azurewebsites.net/api/posts?topic='+ this.data.topic + '&chapter='+ this.data.chapter)
         this.http.get('https://angular2ap.azurewebsites.net/api/posts?topic=erosion&chapter=Sea')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          this.img_data = dataFromServer.sections;
            this.getdata(dataFromServer.sections);
      });
  }

    getdata(data){
    
    for(let section of data.section)
    {

      let len =section.text.text.length;
      section.text.text = section.text.text.substring(9,len-3);

         console.log(section.images.image);
         for(let image of section.images.image)
         {
           if(image.caption!==undefined)
           {
                 let len = image.caption.length;
                 image.caption = image.caption.substring(9,len-3);
           }
           else { image.caption = "Random picha"; }
         }


      }
      // else
      // {
      //     console.log('yes');
      //   let len =section.images.image.caption.length;
      //   section.images.image.caption = section.images.image.caption.substring(2,len-1);

      // }
    }





  savedata()
  {
        this.http.get('https://angular2ap.azurewebsites.net/api/store')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( dataFromServer);
        });
  }

  savenote()
  {
       window.open('https://angular2ap.azurewebsites.net/note/token','_self');
       alert('Saved to Note');

  }
  saveonenote()
  {
       window.open('https://angular2ap.azurewebsites.net/onenote/writenote','_self');
       alert('Saved to One Note');

  }

  ngOnInit() {
  }

}
