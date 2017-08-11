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
saved_data;
toggle = false;
data = {};
nodata = false;
favs_data = [];
  constructor(private http:Http , private DataService:DataService) {

         this.http.get('https://student.almanac-learning.com//api/getdata')
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

  ngOnInit() {
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
      this.http.get('https://student.almanac-learning.com//api/delete?id=' + this.removearticle.chapter)
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( dataFromServer);
            this.loading = false;
            alert('Successfully Deleted');
          window.location.reload();
        });


     
  }
imagesdata='';
  getdata2(dataFromServer)
  {
    this.favs_data = [];
    let arr = dataFromServer;
    let end = arr.length;

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

getdata(data){

   let arr = data;
    let end = arr.length;

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
             videourl.url = 'https://www.youtube.com/embed/' + videourl.url;
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
