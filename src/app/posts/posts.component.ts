import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Image} from '../image.interface';
import {Pipe, PipeTransform} from '@angular/core';
import {HostListener, OnInit, Component, Directive, Output, EventEmitter, Input, SimpleChange} from '@angular/core';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { 
  }
  transform( url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

   color = 'accent';
  mode = 'determinate';
  value1 = 0;
  bufferValue = 75;

    @HostListener('window:scroll', ['$event'])
        track(event) {
        let s:number = window.scrollY; ;
           let d:number = document.body.scrollHeight;
           let scrollPercent:number = s / d;
        var position = scrollPercent;
        this.value1 = position * 110;
        console.log(position);
        }
      

      private NextPhotoInterval:number = 3000;
      private NextPhotoInterval2:number = 100;
      //Looping or not
      private noLoopSlides:boolean = false;
      private noLoopSlides2:boolean = true;
      onenoteloader = false;
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
      window.scrollTo(0,0);
      this.data = this.DataService.myquery;
      console.log(this.DataService.modulename ,'Article id' , this.DataService.myquery.articleid);
    this.http.get('https://student.almanac-learning.com/api/posts?topic='+ this.data.topic + '&chapter='+ this.data.chapter + '&moduleid='+ this.DataService.moduleid + '&modulename=' + this.DataService.modulename + '&articleid=' + this.data.articleid )
  
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
         
          console.log(dataFromServer );
      
        //   this.getdata3(dataFromServer);
             this.img_data = dataFromServer;
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
videos2 = [];


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
          let i = 0;
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
                          {
                          videourl.url = 'https://www.youtube.com/embed/' + videourl.url;
                        }
                    }
                    // for(let videourl of section.videos)
                    let del = false; let k = 0;
                    for(let i=0 ; i < section.videos.length; i++)
                    {   
                       let videourl = section.videos[i];
                      if(del == true)
                      {
                   //       videourl = section.videos[k];
                          del = false;
                          k=0;
                      }
                     
                        let found = false;
                        for(let vid of this.videos2)
                        {
                            if(vid == videourl.url )
                            {    
                                      k = section.videos.indexOf(videourl);
                                   section.videos.splice(section.videos.indexOf(videourl), 1);
                                        found = true;
                                        console.log('found and deleted', videourl , vid);
                                        del = true;
                                        i = k - 1;
                                         break;
                            }
                        }
                        if(found == false)
                         this.videos2.push(videourl.url);
                    }
          }
           if(section.images !== undefined)
           {
           for(let image of section.images)
           {
               if(image.attribution == 'Publisher')
           image.url = image.url + this.DataService.key;
             if(image.width > this.hugeimage)
             {
                this.hugeimageurl = image.url;
             }
             if(image.url !== null)
             this.images2.push(image.url);
           }
           if(section.images.length > 0)
            this.images.push(section.images[0].url + this.DataService.key);
           }
           i++;
        }
        }
        console.log('Videos' ,this.videos);
           console.log('Images' ,this.images , this.images2);
                             console.log('Removed videos' , this.videos2);

     

  }

  list = [];
  removedups(data)
  {    
         let arr = data;
                  let end = arr.length;                  // Remove duplicates

                  for (let i = 0; i < end; i++) {
                      for (let j = i + 1; j < end; j++) {
                          if (arr[i].url == arr[j].url) {                  
                              let shiftLeft = j;
                              for (let k = j+1; k < end; k++, shiftLeft++) {
                                  arr[shiftLeft] = arr[k];
                              }
                              end--;
                              j--;
                          }
                      }
                  }
                  for(let i = 0; i < end; i++){
                      this.list[i] = arr[i];
                  }
                  console.log(this.list);
  }



  getdata3(data){
    let videos2 = [];
      console.log(data);
      for(let mode of data.modes)
      {
      for(let section of mode.sections)
      {
      let len =section.text.text.length;
      console.log('Length of text is' ,len);
      section.text.text = section.text.text.substring(9,len-3);

            if(section.videos !== undefined)
            {
                  if(videos2.length == 0)
                  {
                  videos2.push('https://www.youtube.com/embed/' + section.videos[0].url);
                  }
                //   for(let videourl of section.videos)
                //   {
                //     for(let i of videos2)
                //     { 
                //       console.log(i);
                //     if(i == videourl.url)
                //     {
                //         // section.videos.delete(videourl);
                //         console.log(' matched and deleted');
                //         continue;
                //     }
                //     else
                //     {
                //           if(videourl.attribution == 'Youtube')
                //           {
                //           videourl.url = 'https://www.youtube.com/embed/' + videourl.url;
                //           videos2.push(videourl.url);
                //           }
                //       }
                //         }
                // }
                
              }


         if(section.images !== undefined)
         for(let image of section.images)
         {
           console.log(image.caption);
       
           if(image.attribution == 'Publisher'){
           image.url = image.url + this.DataService.key;
           console.log('key added' + this.DataService.key);
          }
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
  }


    getdata(data){

  for(let mode of data.modes)
    {
    for(let section of mode.sections)
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
   
    }


  savedata()
  {
        this.http.get('https://student.almanac-learning.com/api/store')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( dataFromServer);
        });
  }

  getmouselocation(event)
  {
    var x = event.clientX;
    var y = event.clientY;
    var coords = "X coords: " + x + ", Y coords: " + y;
    console.log(coords);
  }



  saveonenote4()
  {
    this.onenoteloader = true;
    this.http.get('https://student.almanac-learning.com/onenote/checknote4')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( dataFromServer);
          this.onenoteloader = false;
              window.scrollTo(0,0);
              if(dataFromServer == 'Push To OneNote Failed')
              {
                alert('Push To OneNote Failed');
              }
              else alert('Export Successful');
        });
  }
  onenotemodal = false;


  checknote()
  {
       this.http.get('https://student.almanac-learning.com/onenote/checknote2')
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
        //  this.http.get('https://student.almanac-learning.com/api/getdata')
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

  scrolltop()
  {
    console.log('takes you to top');
    window.scrollTo(0,0);
  }
  



}
