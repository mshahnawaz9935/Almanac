import { CanActivate, Router, ActivatedRouteSnapshot,  RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';
import { DataService } from './DataService';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router:Router, private http:Http, private DataService: DataService){}

  canActivate() {

        console.log("canActivate : AuthGuard", this.DataService.authenticated1);
        if (this.DataService.authenticated1 == true) {
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['/account']);
        return false;
 
  }

}