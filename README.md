# Moviedb

The purpose of this project is to browse, search, display and categorize movies into User-defined collections. 

Users can browse Popular, Trending, Upcoming ,Top Rated, Now Playing, and Movies categorized by Genre, obtaining a paginated list of movies for each category along with their details (title/poster/rating). They can also select the region of interest for Upcoming and Now Playing movies to display the corresponding results. 

By selecting a movie card from the lists, the Movie Details Full Page opens, displaying detailed information about the selected movie. On the Movie Details Page, there is also an option to rate the selected movie and add it to a collection in the custom collections popup.

The user can search by a validated keyword for movies by their original, translated and alternative titles and get the paginated results list of movies, along with their details (title/poster/rating). 

By selecting a movie card from the search results, the Movie Details Full Page opens, displaying detailed information about the selected movie. On the Movie Details Page, there is also an option to rate the selected movie and add it to a collection in the custom collections popup. Additionally, there is also a Quick Look Button option that opens a popup with some information about the selected movie and also provides the rating option.

Users can select a movie and then choose a collection to add it to from a custom collections list that appears in a pop up. There is also the option to add multiple movies at once to a custom collection from the available ones.

The custom collections can be created by the user using a title and a short description for every collection. 

Collections can be managed at Movies Collections Page, where the user can create a new custom collection , see all the created collections, see the rated movies from this current visit, remove a collection from the list or delete all collections. 

Each collection navigates to a new page containing the collection's informations and the movies list that contains, where movies can be deleted from the collection or Movie Details Page can be accessed.

The application is based on the following free API: https://developers.themoviedb.org/3/getting-started


Technologies: Angular, HTML, CSS, TypeScript, Bootstrap

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
