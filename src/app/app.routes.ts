import { Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { NowPlayingComponent } from './component/now-playing/now-playing.component';
import { SearchComponent } from './component/search/search.component';
import { TrendingComponent } from './component/trending/trending.component';
import { GenresComponent } from './component/genres/genres.component';
import { PopularComponent } from './component/popular/popular.component';
import { TopRatedComponent } from './component/top-rated/top-rated.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: LandingPageComponent },
    { path: "now-playing", component: NowPlayingComponent},
    { path: "search", component: SearchComponent },
    { path: "trending", component: TrendingComponent},
    { path: "popular", component: PopularComponent},
    { path: "top-rated", component: TopRatedComponent},
    { path: "genres/:name", component: GenresComponent }
];
