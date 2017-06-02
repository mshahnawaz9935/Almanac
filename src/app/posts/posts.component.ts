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
    saved = false;
    value='';
    data;
    saved_data = [];
    img_data = { x : ''};
    videoarray = [{url:'https://www.youtube.com/embed/tpYUAlZ64mE'},{url:'https://www.youtube.com/embed/tpYUAlZ64mE'}];

  constructor(private http:Http,private DataService: DataService, private sanitizer: DomSanitizer, private router:Router) { 

      this.data = this.DataService.myquery;
    this.http.get('http://localhost:3000/api/posts?topic='+ this.data.topic + '&chapter='+ this.data.chapter)
        // this.http.get('http://localhost:3000/api/posts?topic=erosion&chapter=Sea')
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
        this.http.get('http://localhost:3000/api/store')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( dataFromServer);
        });
  }

  savenote()
  {
       window.open('http://localhost:3000/note/token','_self');
       alert('Saved to Note');

  }
  saveonenote()
  {
       window.open('http://localhost:3000/onenote/writenote','_self');
       alert('Saved to One Note');

  }
  showdata()
  { 
          this.saved = true;
         this.http.get('http://localhost:3000/api/getdata')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( 'Saved data in db' , dataFromServer);
          this.saved_data = dataFromServer;
          console.log(this.saved_data);
            // for(let section of dataFromServer)
            // {     
            //     console.log('sections are', section.sections , section.title);

            // }

        });

  }

  ngOnInit() {
  }

}
