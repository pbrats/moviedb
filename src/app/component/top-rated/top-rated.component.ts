import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MoviesService } from '../../service/movies.service';
import { Router } from '@angular/router';
import { CollectionsPopupComponent } from '../collections-popup/collections-popup.component';

@Component({
  selector: 'app-top-rated',
  standalone: true,
  imports: [CommonModule, CollectionsPopupComponent],
  templateUrl: './top-rated.component.html',
  styleUrl: './top-rated.component.css'
})
export class TopRatedComponent {
  hasLoadedTop: boolean = false;
  top: any;
  totalPages = 0; // total pages of the data from API
  currentPage = 1; // set initial page the 1st
  startIndex = 0;
  endIndex = 0;
  pageSize = 20; // Number of movies per page default by API
  totalMovies: any;
  selectedId!: number;
  constructor(private router: Router, private movieService: MoviesService) { }
  ngOnInit() {
    this.loadTop(1);
  }
  loadTop(page: number) {
    this.movieService.getTop(page).subscribe({
      next: top => {
        setTimeout(() => {
          this.top = top;
          this.hasLoadedTop = true;
          console.log(top);
          this.totalPages = this.top.total_pages;
          console.log("total pages: ", this.totalPages);
          this.totalMovies = this.top.total_results;
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
    this.loadTop(this.currentPage);
    console.log("displayedMovies:", this.top);
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