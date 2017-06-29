import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Image} from '../image.interface';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


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
    img_data = [];
    videoarray = [{url:'https://www.youtube.com/embed/tpYUAlZ64mE'},{url:'https://www.youtube.com/embed/tpYUAlZ64mE'}];
    notebook_exists = true;
    loading: Boolean;

  constructor(private http:Http,private DataService: DataService, private sanitizer: DomSanitizer, private router:Router) { 

      this.data = this.DataService.myquery;
      console.log(this.DataService.modulename ,'Article id' , this.DataService.myquery.articleid);
    this.http.get('http://localhost:3000/api/posts?topic='+ this.data.topic + '&chapter='+ this.data.chapter + '&moduleid='+ this.DataService.moduleid + '&modulename=' + this.DataService.modulename + '&articleid=' + this.data.articleid )
  
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          this.loading = false;
          console.log(dataFromServer ,'sections ', dataFromServer.sections);
          this.img_data = dataFromServer.sections;
            this.getdata(dataFromServer.sections);
            
            
      });
  }

    getdata(data){
    
    for(let section of data)
    {
      console.log(section , section.text ,section.text.text);
      let len =section.text.text.length;
      console.log('Length of text is' ,len);
      section.text.text = section.text.text.substring(9,len-3);

         console.log(section.images);
         for(let image of section.images)
         {
           console.log(image.caption);
           if(image.caption == null){
           image.caption = "Random picha";
           continue; 
           }
           if(image.caption!==undefined || image.caption !== null)
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
      // window.open('http://localhost:3000/onenote/writenote','_self');
       alert('Saved to One Note');
        this.http.get('http://localhost:3000/onenote/writenote')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Write note', dataFromServer);
        });

  }

  saveonenote2()
  {
    this.loading = true;
    this.http.get('http://localhost:3000/onenote/checknote3')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Data Saved to One Note', dataFromServer);
          alert('Save to One Note');
          this.loading = false;
        });
  }



  checknote()
  {
       this.http.get('http://localhost:3000/onenote/checknote2')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Check note', dataFromServer);
          if(dataFromServer == 'Notebook exists')
          this.notebook_exists = true;
          else this.notebook_exists = false;
        });
  }
  showdata()
  { 
          this.saved = true;
          this.loading = true;
         this.http.get('http://localhost:3000/api/getdata')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( 'Saved data in db' , dataFromServer);
          this.saved_data = dataFromServer;
          console.log(this.saved_data);
          this.loading = false;
            // for(let section of dataFromServer)
            // {     
            //     console.log('sections are', section.sections , section.title);

            // }

        });

  }

  ngOnInit() {
    this.loading = true;
  }

  



}
