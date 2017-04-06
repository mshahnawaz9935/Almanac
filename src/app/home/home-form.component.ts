import { Component } from '@angular/core';
import { Car }    from './car';
@Component({
    selector:'home-form',
  templateUrl:'home-form.component.html'
})
export class HomeFormComponent {
  types = ['Garaged', 'Home'];
 ncbs = ['6 year' , '2 year', '3 Year' , '4 Year'];
  model = new Car(18, '11 D 4345', this.types[0], this.ncbs[0], 'D O Lier Street');
  submitted = false;
  onSubmit() { this.submitted = true; }
  // TODO: Remove this when we're done
// TODO: Workaround until NgForm has a reset method (#6822)
  active = true;
  newCar() {
    this.model = new Car(42, '','', '');
    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  get diagnostic() { return JSON.stringify(this.model); }
}