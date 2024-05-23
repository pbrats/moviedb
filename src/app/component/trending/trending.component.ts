import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../service/movies.service';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.css'
})
export class TrendingComponent {
  hasLoadedTrending: boolean = false;
  trending: any;
  time!: string;
  timeForm!: FormGroup;
  totalPages = 0; // total pages of the data from API
  currentPage = 1; // set initial page the 1st
  startIndex = 0;
  endIndex = 0;
  pageSize = 20; // Number of movies per page default by API
  totalMovies: any;
  buttonDay!: boolean;
  buttonWeek!: boolean;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private movieService: MoviesService, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        console.log("params:", params);
        this.time = params['time'];
        console.log("this time:", this.time);
        if(this.time=='day'){
          this.buttonDay = true;
          this.buttonWeek = false;
        }else if(this.time=='week'){
          this.buttonWeek = true;
          this.buttonDay = false;
        }
      });
      this.timeForm = this.formBuilder.group({
        selectedRegion: [this.time ||'day']
      });
    this.loadTrending(this.time, this.currentPage);
  }
  
  onClickTime(buttonName: string) {
    console.log('Selected time :', buttonName);
      this.time = buttonName;
      this.router.navigate(['trending'],{ queryParams: { time: this.time} });
    this.currentPage =1;
    this.loadTrending(this.time, this.currentPage);
  }
  loadTrending(time: string, page: number) {
    this.movieService.getTrending(time, page).subscribe({
      next: trending => {
        setTimeout(() => {
          this.trending = trending;
          this.hasLoadedTrending = true;
          console.log(trending);
          // this.totalPages = this.trending.total_pages; 
          // the api says by default "total_pages": 1000 but only gets 500 so
          this.totalPages = 500;
          console.log("total pages: ",this.totalPages);
          // this.totalMovies = this.trending.total_results;
          // the api says by default  "total_results": 20000 but only gets 10000 so
          this.totalMovies =10000;
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
    this.loadTrending(this.time,this.currentPage);
    console.log("displayedMovies:", this.trending);
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
}
