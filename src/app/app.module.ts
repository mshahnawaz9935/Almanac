import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule,MdInputModule  } from '@angular/material';
import { AppComponent} from './app.component';
import { HomeComponent } from './home/home.component';
import { HomeFormComponent} from './home/home-form.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SupportComponent } from './support/support.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { routing, appRoutingProviders } from './app.routing';
import { FooterComponent } from './footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule} from 'ng2-flex-layout';
import { SearchComponent } from './search/search.component';
import { PostsComponent } from './posts/posts.component';
import { AccountComponent } from './account/account.component';
import { DataService} from './DataService';
import { AuthGuard } from './AuthGuard';
import { PricingComponent } from './pricing/pricing.component';
import { NouisliderModule } from 'ng2-nouislider';
import { ModulesComponent } from './modules/modules.component';
import {CSSCarouselComponent} from './pricing/carousel.component2';
import { Carousel } from './pricing/carousel.component';
import { Slide } from './pricing/slide.component';
import { ResultsComponent } from './results/results.component';
import { SafePipe} from './posts/posts.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactUsComponent,
    SupportComponent,
    MenuBarComponent,
    FooterComponent,
    HomeFormComponent,
    SearchComponent,
    PostsComponent,
    AccountComponent,
    PricingComponent,
    ModulesComponent,
    CSSCarouselComponent,
    Carousel,Slide,
    ResultsComponent ,
    SafePipe
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
    FlexLayoutModule,
    LayoutModule,
    NouisliderModule
  ],
  providers: [appRoutingProviders,
   DataService,
    AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
