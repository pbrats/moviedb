import { Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { NowPlayingComponent } from './component/now-playing/now-playing.component';
import { SearchComponent } from './component/search/search.component';
import { TrendingComponent } from './component/trending/trending.component';
import { GenresComponent } from './component/genres/genres.component';
import { PopularComponent } from './component/popular/popular.component';
import { TopRatedComponent } from './component/top-rated/top-rated.component';
import { UpcomingComponent } from './component/upcoming/upcoming.component';
import { MovieIdComponent } from './component/movie-id/movie-id.component';
import { CollectionsComponent } from './component/collections/collections.component';
import { CreateCollectionComponent } from './component/create-collection/create-collection.component';
import { CollectionDetailsComponent } from './component/collection-details/collection-details.component';
import { RatedMoviesComponent } from './component/rated-movies/rated-movies.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { ModalContainerComponent } from './component/modal-container/modal-container.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: LandingPageComponent },
    {
        path: "search",
        component: SearchComponent,
        children: [
            { path: "movies/:id", component: ModalContainerComponent } 
        ]
    },
    { path: "movies/:id", component: MovieIdComponent },
    { path: "now-playing", component: NowPlayingComponent },
    { path: "trending", component: TrendingComponent },
    { path: "popular", component: PopularComponent },
    { path: "top-rated", component: TopRatedComponent },
    { path: "upcoming", component: UpcomingComponent },
    { path: "genres/:name", component: GenresComponent },
    { path: "collections", component: CollectionsComponent },
    { path: "collections/create", component: CreateCollectionComponent },
    { path: "collections/rated", component: RatedMoviesComponent },
    { path: "collections/:title", component: CollectionDetailsComponent },
    { path: "not-found", component: NotFoundComponent },
    { path: "**", component: NotFoundComponent }

];
