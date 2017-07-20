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
    hidden= false;
    saved_data = [];
    img_data = [];
    videoarray = [{url:'https://www.youtube.com/embed/tpYUAlZ64mE'},{url:'https://www.youtube.com/embed/tpYUAlZ64mE'}];
    notebook_exists = true;
    loading: Boolean;

  constructor(private http:Http,private DataService: DataService, private sanitizer: DomSanitizer, private router:Router) { 

      this.data = this.DataService.myquery;
      console.log(this.DataService.modulename ,'Article id' , this.DataService.myquery.articleid);
    this.http.get('https://students.almanac-learning.com/api/posts?topic='+ this.data.topic + '&chapter='+ this.data.chapter + '&moduleid='+ this.DataService.moduleid + '&modulename=' + this.DataService.modulename + '&articleid=' + this.data.articleid )
  
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
         
          console.log(dataFromServer );
        //  this.img_data = dataFromServer.sections;
          //  this.getdata(dataFromServer.sections);
            this.getdata2(dataFromServer.modes);
             this.loading = false;
             this.hidden = true;
            
      });
  }
text=[];
videos=[];
images=[];
images2=[];
hugeimage = 0;
hugeimageurl = '';
title= [];
  getdata2(data)
  {
    this.images = [];
   this.text= [];
   this.videos= [];
   this.images2 = [];
   this.title = [];

        for(let mode of data)
        {
          mode = mode.sections;
        for(let section of mode)
        {
            this.title.push(section.title);
                let len =section.text.text.length;
                section.text.text = section.text.text.substring(9,len-3);
           this.text.push(section.text.text);
           if(section.videos !== undefined)
           {
           for(let videourl of section.videos)
           {
             if(videourl.attribution == 'Youtube')
             videourl.url = 'https://www.youtube.com/embed/' + videourl.url;
             this.videos.push(videourl.url);
           }
          }
           if(section.images !== undefined)
           {
           for(let image of section.images)
           {
             if(image.width > this.hugeimage)
             {
                this.hugeimageurl = image.url;
             }
             if(image.url !== null)
             this.images2.push(image.url);
           }
           if(section.images.length > 0)
            this.images.push(section.images[0].url);
           }
        }
        }
        console.log('Videos' ,this.videos);
           console.log('Images' ,this.images , this.images2);
     

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
   
    }


  savedata()
  {
        this.http.get('https://students.almanac-learning.com/api/store')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( dataFromServer);
             alert('Saved to Favourites');
        });
  }

  savenote()
  {
       window.open('https://students.almanac-learning.com/note/token','_self');
       alert('Saved to Note');

  }
  saveonenote()
  {
      // window.open('https://students.almanac-learning.com/onenote/writenote','_self');
        this.http.get('https://students.almanac-learning.com/onenote/writenote')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Write note', dataFromServer);
           alert('Saved to One Note');
        });

  }

  saveonenote2()
  {
    this.loading = true;
    this.http.get('https://students.almanac-learning.com/onenote/checknote3')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Data Saved to One Note', dataFromServer);
          alert('Save to One Note');
          this.loading = false;
        });
  }
  saveonenote4()
  {
    this.loading = true;
    this.http.get('https://students.almanac-learning.com/onenote/checknote4')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Data Saved to One Note', dataFromServer);
          alert('Save to One Note 4');
          this.loading = false;
        });
  }



  checknote()
  {
       this.http.get('https://students.almanac-learning.com/onenote/checknote2')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Check note', dataFromServer);
          if(dataFromServer == 'Notebook exists')
          this.notebook_exists = true;
          else this.notebook_exists = false;
        });
  }
  showfav()
  { 
        this.router.navigate(['/favourites']);

        //   this.saved = true;
        //   this.loading = true;
        //  this.http.get('https://students.almanac-learning.com/api/getdata')
        // .map((res: Response) => res.json()).subscribe((dataFromServer) => {
        //   console.log( 'Saved data in db' , dataFromServer);
        //   this.saved_data = dataFromServer;
        //   console.log(this.saved_data);
        //   this.loading = false;

        // });

  }

  ngOnInit() {
    this.loading = true;
  }

  



}
