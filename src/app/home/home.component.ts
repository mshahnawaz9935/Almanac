import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
   // directives: ['ShowItBootstrap','HideItBootstrap'],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {

  constructor(private DataService:DataService, private router:Router) {


   }

  ngOnInit() {

  }

  getmodules()
  {
    if(this.DataService.authenticated1 == true)
      this.router.navigate(['/modules']);
    else this.router.navigate(['/account']);
  }

}
