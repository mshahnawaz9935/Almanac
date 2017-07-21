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
toggle = true;
data = {};
nodata = false;
favs_data = [];
  constructor(private http:Http) {
    this.toggle = true;

         this.http.get('https://student.almanac-learning.com/api/getdata')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( 'Saved data in db' , dataFromServer);
          if(dataFromServer.length == 0 )
          this.nodata =true;
          else this.nodata = false;
          this.getdata(dataFromServer);
            this.saved_data = dataFromServer;
                 this.getdata2(dataFromServer);
          console.log(this.saved_data);
          this.loading = false;
     
        });
   }

  ngOnInit() {
  }

  onSelect(index)
  {
    console.log('Index is' ,index);
    this.toggle = false;
    this.data = this.saved_data[index];
  }

  removearticle;
  deleteArticle(index)
  { 
    this.loading = true;
         console.log('Removed article is' , this.removearticle);
     this.removearticle = this.saved_data[index];
      this.http.get('https://student.almanac-learning.com/api/delete?id=' + this.removearticle._id)
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

    for(let data of dataFromServer)
    {
       let title = data.title;
       let description = data.description;
       let modulename = data.modulename;
       
       for(let mode of data)
       {
       for(let section of mode.sections)
       {
         if(section.images.length >0 )
          {
             for(let image of section.images)
             {
               if(image.url !== undefined)
               {
                this.imagesdata = image.url;
                console.log('here image url', image);
                break;
               }
             }
          }

        }
       }
            console.log('here image url', this.imagesdata);
        this.favs_data.push({ 'title': title , 'description' : description , 'modulename' : modulename , 'image': this.imagesdata  });
    }
    console.log('Favs data is' , this.favs_data);

  }  


      
  getdata(data){
    
    for(let data1 of data)
    {
     
     let mode= data1.modes;
       console.log('Modes' , mode);
      for(let data1 of mode)
      {
      for(let section of data1)
      {
      let len =section.text.text.length;
      console.log('Length of text is' ,len);
      section.text.text = section.text.text.substring(9,len-3);

         console.log(section.images);
         if(section.images.length > 0)
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
  }



}
