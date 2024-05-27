import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MoviesService } from '../../service/movies.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-collections-popup',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './collections-popup.component.html',
  styleUrl: './collections-popup.component.css'
})
export class CollectionsPopupComponent {
  @Input() id!: number;
  movieDetails: any = {};
  showSuccessMessage: boolean = false;
  collections: any;
  selectedCollection: any;
  collectionsMovies: any;
  flagExists: boolean = false;
  selectedCollectionTitle!: string;
  hasCollections: boolean = false;
  constructor(private router: Router, private movieService: MoviesService) { }
  ngOnInit() {
    if (this.id) {
      console.log('id collection:', this.id);
      this.movieService.getMovieDetails(this.id).subscribe(
        (movieDetails) => {
          this.movieDetails = movieDetails;
          console.log('movie details for collection:', this.movieDetails);
        });
    }
    const savedCollections = localStorage.getItem("Collections");
    if (savedCollections) {
      this.collections = JSON.parse(savedCollections);
      console.log("saved collections:", this.collections);
      if (this.collections.length >= 0) {
        this.hasCollections = true;
      } else {
        this.hasCollections = false;
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.id) {
      console.log('changes id collcetion:', changes);
      if (changes['id']) {
        console.log('change id collcetion :', changes['id'].currentValue);
        this.id = changes['id'].currentValue; //if the value of id has changed set the current value to id
        this.movieService.getMovieDetails(this.id).subscribe((movieDetails) => {
          this.movieDetails = movieDetails;
          console.log('new movie details with changed id for collection', this.movieDetails);
        });
      }
    }
  }
  addToCollection(title: string) {
    console.log("add movie id", this.id);
    console.log("to collection:", title);
    this.selectedCollectionTitle = title;
    this.selectedCollection = this.collections.filter((item: any) => item.title === title);
    console.log("selected collection:", this.selectedCollection);
    for (const detail of this.selectedCollection) {
      if (detail.moviesList.length > 0) {
        let exists = detail.moviesList.filter((item: any) => item.id === this.id);
        console.log("exists", exists);
        if (exists.length > 0) {
          console.log("Movie already exists in this collection!");
          this.flagExists = true;
          this.showSuccessMessage = false;
          setTimeout(() => {
            this.flagExists = false; //timeout to auto dismiss after certain time
          }, 5000);
        } else {
          detail.moviesList.push(this.movieDetails);
          console.log("Movie added to moviesList:", detail.moviesList);
          console.log("selected collection:", this.selectedCollection);
          console.log("saved collections:", this.collections);
          localStorage.setItem("Collections", JSON.stringify(this.collections));
          this.showSuccessMessage = true;
          this.flagExists = false;
          setTimeout(() => {
            this.showSuccessMessage = false; //timeout to auto dismiss after certain time
          }, 5000);
        }
      } else {
        detail.moviesList = [this.movieDetails];
        console.log("1st Movie added to moviesList:", detail.moviesList);
        console.log("selected collection:", this.selectedCollection);
        console.log("saved collections:", this.collections);
        localStorage.setItem("Collections", JSON.stringify(this.collections));
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false; //timeout to auto dismiss after certain time
        }, 5000);
      }
    }
  }
}
