import { CanActivate, Router, ActivatedRouteSnapshot,  RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http ,Response} from '@angular/http'; 
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanActivate {
    authenticated1;
    constructor(private router:Router, private http:Http)
    {
    this.http.get('https://angular2ap.azurewebsites.net/onenote/checklogin')
        .map((res: Response) => res.json()).subscribe((dataFromServer) => {
          console.log('Login status is ' + dataFromServer );
          if(dataFromServer == 'No Login')
          {
          this.authenticated1 = false;
          }
          else
          { this.authenticated1 =true;
          console.log(this.authenticated1);
        }
        });
    }

  canActivate() {

        console.log("canActivate : AuthGuard");
        if (this.authenticated1 == true) {
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['/account']);
        return false;
 
  }

}