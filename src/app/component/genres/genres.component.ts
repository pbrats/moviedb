import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../service/movies.service';
import { CommonModule } from '@angular/common';
import { CollectionsPopupComponent } from '../collections-popup/collections-popup.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultipleIdsPopupComponent } from '../multiple-ids-popup/multiple-ids-popup.component';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [CommonModule, CollectionsPopupComponent, FormsModule, ReactiveFormsModule, MultipleIdsPopupComponent],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent {
  genre: any;
  genreMovies: any;
  hasLoadedGenresMovies: boolean = false;
  currentUrl!: string;
  genreName!: string;
  totalPages = 0; // total pages of the data from API
  currentPage = 1; // set initial page the 1st
  startIndex = 0;
  endIndex = 0;
  pageSize = 20; // Number of movies per page default by API
  totalMovies: any;
  selectedId!: number;
  collectionsForm!: FormGroup;
  selectedMoviesId: number[] = [];
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private movieService: MoviesService, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        console.log(params);
        console.log("params:", params);
        this.genre = params['genre'];
        console.log("selected genre:", this.genre);
      });
    this.loadGenreMovies(this.genre, 1);

    this.currentUrl = this.router.url;
    console.log("current url:", this.currentUrl);
    let part1 = this.currentUrl.split('/')[2];
    this.genreName = part1.split('?')[0];
    this.genreName = decodeURIComponent(this.genreName);
    console.log("genre name:", this.genreName);
    this.setFormValues();
  }
  setFormValues() {
    this.collectionsForm = new FormGroup({
      movieChecked: new FormControl("", Validators.requiredTrue)
    });
  }
  onSelect() {
    console.log("input value:", this.collectionsForm.value);
    if (this.selectedMoviesId.length > 0) {
      console.log("selectedMoviesId:", this.selectedMoviesId);
      this.collectionsForm.reset();
      console.log("after reset form values:", this.collectionsForm.value);
    }
  }
  onChange(event: any) {
    console.log("selected movies ids length:", this.selectedMoviesId.length);
    if (this.selectedMoviesId.length > 0) {
      console.log("new id to add :", String(event.target.value));
      this.selectedMoviesId.push(event.target.value);
      console.log("selected movies ids :", this.selectedMoviesId);
    } else {
      this.selectedMoviesId = [event.target.value];
      console.log("selected movies ids", this.selectedMoviesId);
    }
  }
  loadGenreMovies(genreId: number, page: number) {
    this.movieService.getMoviesByGenres(genreId, page).subscribe({
      next: genreMovies => {
        setTimeout(() => {
          this.genreMovies = genreMovies;
          this.hasLoadedGenresMovies = true;
          console.log(genreMovies);
          this.totalPages = this.genreMovies.total_pages;
          // the api says by default "total_pages": ... but only gets max 500 so
          if (this.totalPages > 500) {
            this.totalPages = 500;
          }
          console.log("total pages: ", this.totalPages);
          this.totalMovies = this.genreMovies.total_results;
          // the api says by default  "total_results": ... but only gets max 10000 so
          if (this.totalMovies > 10000) {
            this.totalMovies = 10000;
          }
          console.log("total results:", this.totalMovies);
          this.startIndex = (page - 1) * this.pageSize;
          console.log("startIndex:", this.startIndex);
          this.endIndex = Math.min(this.startIndex + this.pageSize - 1, this.totalMovies - 1);
          console.log("endIndex:", this.endIndex);
        }, 0);
      }
    });
  }
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    console.log("currentPage:", this.currentPage);
    this.loadGenreMovies(this.genre, this.currentPage);
    console.log("displayedMovies:", this.genreMovies);
  }
  previousPage(): void {
    this.setPage(this.currentPage - 1);
  }
  nextPage(): void {
    this.setPage(this.currentPage + 1);
  }
  get pages(): number[] {
    const pagesArray: number[] = [];
    const maxPagesToShow = 10; // max pages number buttons to show
    if (this.totalPages <= maxPagesToShow) {  // show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pagesArray.push(i);
      }
    } else {
      pagesArray.push(1); //  to show the first page always
      // define start and end index for the middle pages between ...
      let start = Math.max(2, this.currentPage - 2); //always show this page button and the 2 previous pages buttons
      let end = Math.min(this.totalPages - 1, this.currentPage + 2);//always show this page button and the next 2 pages buttons
      if (start > 2) {
        pagesArray.push(-1);  //to show the ... before pages buttons
      }
      for (let i = start; i <= end; i++) {
        pagesArray.push(i); //to show middle pages buttons
      }
      if (end < this.totalPages - 1) {
        pagesArray.push(-1); //to show the ... before pages buttons
      }
      pagesArray.push(this.totalPages);  // to show the last page always
    }
    return pagesArray;
  }
  moviePage(id: number) {
    console.log('details id:', id);
    this.router.navigate(['movies', id]);
  }
  addToCollection(id: number) {
    this.selectedId = id
    console.log('movie id to add to collection :', id);
  }
}
