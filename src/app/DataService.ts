import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class DataService {

myquery = { topic: '' , chapter : '' };
    constructor(private http: Http) {
        
    }
    



}