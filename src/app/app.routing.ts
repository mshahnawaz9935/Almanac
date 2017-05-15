import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SupportComponent } from './support/support.component';
import { SearchComponent } from './search/search.component';
import { PostsComponent} from './posts/posts.component';
import { AccountComponent } from './account/account.component';
import { PricingComponent } from './pricing/pricing.component';
import { AuthGuard } from './AuthGuard';


const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'support', component: SupportComponent },
    { path: 'contact', component: ContactUsComponent },
    { path: 'search', component: SearchComponent , canActivate: [AuthGuard] },
    { path: 'posts', component: PostsComponent },
    { path: 'account', component: AccountComponent },
    { path: 'pricing', component: PricingComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);