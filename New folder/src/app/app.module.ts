import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent} from './app.component';
import { HomeComponent } from './home/home.component';
import {HomeFormComponent} from './home/home-form.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SupportComponent } from './support/support.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { routing, appRoutingProviders } from './app.routing';
import { FooterComponent } from './footer/footer.component';
import { LayoutModule } from 'ng2-flex-layout';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactUsComponent,
    SupportComponent,
    MenuBarComponent,
    FooterComponent,
HomeFormComponent
  ],
  entryComponents: [
    AppComponent,
  ],
  imports: [
        MaterialModule.forRoot(),
    BrowserModule,
    routing,
    FormsModule,
    HttpModule,
    LayoutModule,
    FlexLayoutModule
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
