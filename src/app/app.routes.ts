import { Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { NowPlayingComponent } from './component/now-playing/now-playing.component';
import { SearchComponent } from './component/search/search.component';
import { TrendingComponent } from './component/trending/trending.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: LandingPageComponent },
    { path: "now-playing", component: NowPlayingComponent},
    { path: "search", component: SearchComponent },
    { path: "trending", component: TrendingComponent},
];
