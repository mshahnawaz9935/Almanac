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
  constructor(private http:Http) {
    this.toggle = true;

         this.http.get('http://localhost:3000/api/getdata')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log( 'Saved data in db' , dataFromServer);
          if(dataFromServer.length == 0 )
          this.nodata =true;
          else this.nodata = false;
          this.getdata(dataFromServer);
            this.saved_data = dataFromServer;
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
      
  getdata(data){
    
    for(let data1 of data)
    {
      console.log(data1 );
      data1= data1.sections;
      
      for(let section of data1 )
      {
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



}
