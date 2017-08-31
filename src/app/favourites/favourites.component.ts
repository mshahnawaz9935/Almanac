import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from '../DataService';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Image} from '../image.interface';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {

array = new Array(6);
loading = true;
loading1= true;
deleting = false;
saved_data;
toggle = false;
data = {};
nodata = false;
noonenotedata=false;
favs_data = [];
image = 'assets/img/almanac/cards/img-favourites-01.jpg';
  constructor(private http:Http , private DataService:DataService) {

      this.getfavs();

          this.http.get('https://student.almanac-learning.com/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );

              if(dataFromServer == 'Logged in')
              {
                    this.getonenote();
              }
              else this.loading1= false;
        })
        console.log(this.DataService.dblogin);
   }

  ngOnInit() {
  }

  getfavs()
  {
        this.loading = true;
       this.http.get('https://student.almanac-learning.com/api/getdata')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
                    console.log( 'Saved data in db' , dataFromServer);
                    if(dataFromServer.length == 0 )
                    this.nodata =true;
                    else this.nodata = false;
                    this.getdata(dataFromServer);
                    this.loading = false;
                    this.saved_data = dataFromServer;
                    this.getdata2(dataFromServer);
                    console.log('Saved_data' , this.saved_data);
        });

  }
  getonenote()
  {       this.loading1= true;
          this.http.get('https://student.almanac-learning.com/onenote/getpages')
                        .map((res: Response) => res.json()).subscribe((Serverdata) => {
                          console.log('Pages are ' + Serverdata );
                          this.getpages(Serverdata);
                          this.deleting = false;
                          this.loading1= false;
                        })

  }



  page = [];
  getpages(data)
  {
    console.log('One note pages' , data);
    this.page = [];
     
     if(data.value !== null && data.value !== undefined)
     for(let pages of data.value)
     {    if(pages.parentNotebook !== undefined && pages.parentNotebook  !== null)
            {
              console.log(pages.parentNotebook);
              if(pages.parentNotebook.displayName == 'TCD Almanac')
              {
                // let k = pages.title.indexOf(" ");
                // if(k>0 && k !== -1)
                // pages.title =  pages.title.substring(0,k);
                let obj = { id: pages.id, title : pages.title, section :  pages.parentSection.displayName  };
                this.page.push(obj);
              }
            }

     }
     console.log(this.page);
     if(this.page.length == 0)
     this.noonenotedata =true;
  }



   scrolltop()
  {
    console.log('takes you to top');
    window.scrollTo(0,0);
  }
  showfavs()
  {
    this.toggle = false;
  }
  onSelect(index)
  {
    console.log('Index is' ,index);
    this.toggle = true;
    this.data = this.saved_data[index];
  }

  removearticle;
  deleteArticle(index)
  { 
    this.loading = true;
         console.log('Removed article is' , this.removearticle);
     this.removearticle = this.saved_data[index];
      this.http.get('https://student.almanac-learning.com/api/delete?id=' + this.removearticle.chapter)
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log(dataFromServer);
          this.getfavs();
        });
  }

  deleteOneNoteArticle(index)
  { 
    this.deleting = true;
      console.log('Page id is', index);
      this.http.get('https://student.almanac-learning.com/onenote/deletepages?pageid=' + index)
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( dataFromServer);
          this.deleting =false; 
          setTimeout(() => {  this.getonenote();},800 );
        
        });
  }



imagesdata='';
  getdata2(dataFromServer)
  {
    this.favs_data = [];
    let arr = dataFromServer;
    let end = arr.length;                  // Remove duplicates

    for (let i = 0; i < end; i++) {
        for (let j = i + 1; j < end; j++) {
            if (arr[i].chapter == arr[j].chapter) {                  
                let shiftLeft = j;
                for (let k = j+1; k < end; k++, shiftLeft++) {
                    arr[shiftLeft] = arr[k];
                }
                end--;
                j--;
            }
        }
    }

    let whitelist = [];
    for(let i = 0; i < end; i++){
        whitelist[i] = arr[i];
    }
    console.log( whitelist);
    dataFromServer = whitelist;
  
    for(let data of dataFromServer)
    {
       let title = data.title;
       let description = data.description;
       let modulename = data.modulename;
       let topic = data.topic;
       let chapter = data.chapter;
       for(let mode of data)
       {
       for(let section of mode.sections)
       {
         if(section.images.length >0 )
          {
             for(let image of section.images)
             { let bool = false;
               if(image.url !== undefined)
               {
                this.imagesdata = image.url;
                console.log('here image url', image.url);
                bool = true;
               }
               if(bool == true)
               break;
             }
          }

        }
       }
            console.log('here imagedata url', this.imagesdata);
        this.favs_data.push({ 'title': title , 'topic':topic , 'chapter' : chapter ,'description' : description , 'modulename' : modulename , 'image': this.imagesdata  });
    }
    console.log('Favs data is' , this.favs_data);

  }  

videos2 = [];
getdata(data){

   let arr = data;
    let end = arr.length;

    for (let i = 0; i < end; i++) {              // Remove duplicates
        for (let j = i + 1; j < end; j++) {
            if (arr[i].chapter == arr[j].chapter) {                  
                let shiftLeft = j;
                for (let k = j+1; k < end; k++, shiftLeft++) {
                    arr[shiftLeft] = arr[k];
                }
                end--;
                j--;
            }
        }
    }

    let whitelist = [];
    for(let i = 0; i < end; i++){
        whitelist[i] = arr[i];
    }
    console.log( whitelist);
      data =  whitelist;
    
    for(let data1 of data)
    {
      for(let mode of data1.modes)
      {
      for(let section of mode.sections)
      {
      let len =section.text.text.length;
      console.log('Length of text is' ,len);
      section.text.text = section.text.text.substring(9,len-3);

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
  }


      




}
