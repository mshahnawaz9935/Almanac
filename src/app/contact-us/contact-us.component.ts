import { Component, OnInit } from '@angular/core';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { User }    from './User';
import { Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  data=[];

  model = new User('Ash', '087235');
  submitted = false;



  constructor(private http:Http) { }

  ngOnInit() {
  }
  obj={};
  onclick()
  {
    this.http.get('http://localhost:3000/api/users')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          this.data = dataFromServer;
          console.log(this.data);
        //  console.log('Data from post api is ' + this.img_data.image[0].url );
        });
  }
      onSubmit() 
      { 
        this.submitted = true;
        console.log(this.model.name + '  ' +  this.model.phone);
        this.obj = { name : this.model.name , phone : this.model.phone } 
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.http.post('http://localhost:3000/api/users', { name : this.model.name , phone: this.model.phone } , options)
                        .map(this.extractData)
                        .subscribe((dataFromServer) => dataFromServer );
      }
      private extractData(res: Response) {
      let body = res.json();
      console.log('body is ', body);
      return body.data || { };
      
    }
    ondelete()
    {
      this.http.delete('http://localhost:3000/api/users/'+this.model.name) // ...using put request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                          .subscribe(
                                data => {
                                    data ; console.log('deleted');
                                }, 
                                err => {
                                    console.log(err);
                                });
          this.onclick();
    }   

}
