import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MoviesService } from '../../service/movies.service';
import { CollectionsPopupComponent } from '../collections-popup/collections-popup.component';
import { MultipleIdsPopupComponent } from '../multiple-ids-popup/multiple-ids-popup.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterLinkActive, CollectionsPopupComponent, MultipleIdsPopupComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchForm!: FormGroup;
  searchQuery: string = '';
  searchMovies: any;
  flag: boolean = false; //flag that search button was clicked with a valid input
  displayedMovies: any;
  currentPage = 1; // set initial page the 1st
  totalPages = 0; // total pages of the data from API
  pageSize = 20; // Number of movies per page default by API
  startIndex = 0;
  endIndex = 0;
  totalMovies = 0; //total movies matching the search
  selectedId!: number;
  hasLoadedresults: boolean = false; //boolean to show spinner loading if the results aren't fetched
  currentUrl: string = '';
  collectionsForm!: FormGroup;
  selectedMoviesId: number[] = [];
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private searchMovieService: MoviesService, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        console.log("params:", params);
        this.searchQuery = params['query'];
        console.log("this search query:", this.searchQuery);
      });
    if (this.searchQuery) {
      this.flag = true;
      this.loadSearchResults(this.searchQuery, this.currentPage);
    }
    this.searchForm = this.formBuilder.group({
      searchData: new FormControl(this.searchQuery || '', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.minLength(3)])
    });
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
      console.log("after reset form values:",this.collectionsForm.value);
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
  onSubmit() {
    console.log("input value:", this.searchForm.get("searchData")?.value);
    this.searchQuery = this.searchForm.get("searchData")?.value;
    console.log("search query:", this.searchQuery);
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    if (this.searchQuery) {
      this.flag = true;
      this.loadSearchResults(this.searchQuery, 1);
    }
  }
  loadSearchResults(query: string, page: number) {
    this.searchMovieService.getMoviebyQuery(query, page).subscribe({
      next: searchMovies => {
        setTimeout(() => {
          this.searchMovies = searchMovies;
          console.log(searchMovies);
          this.totalPages = this.searchMovies.total_pages;
          console.log("total pages:", this.totalPages);
          this.totalMovies = this.searchMovies.total_results;
          console.log("total results:", this.totalMovies);
          this.startIndex = (page - 1) * this.pageSize;
          console.log("startIndex:", this.startIndex);
          this.endIndex = Math.min(this.startIndex + this.pageSize - 1, this.totalMovies - 1);
          console.log("endIndex:", this.endIndex);
          this.hasLoadedresults = true;
        }, 10);
      }
    });
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    console.log("currentPage:", this.currentPage);
    this.loadSearchResults(this.searchQuery, this.currentPage);
    console.log("displayedMovies:", this.searchMovies);
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
  onMovieClick(id: number) {
    console.log("id search:", id);
    //option 1 routes
    this.router.navigate(['search/movies', id]);
    //option 2 routes
    //  this.router.navigate(["search", id ,"movies"]);
    //if i want the url to be same as would get with this.router.navigate(["movies", id]); but without redirecting
    this.currentUrl = this.router.url;
    console.log("current url", this.currentUrl);
    // const baseUrl = currentUrl.split('/')[0];
    // console.log("baseurl", baseUrl);
    // const newUrl = baseUrl + `movies/${id}`;
    // console.log("new  url", newUrl);
    // window.history.replaceState({}, '', newUrl); //set the url to movies/id without redirect
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
