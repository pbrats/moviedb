import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesService } from '../../service/movies.service';

@Component({
  selector: 'app-multiple-ids-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-ids-popup.component.html',
  styleUrl: './multiple-ids-popup.component.css'
})
export class MultipleIdsPopupComponent {
  @Input() idArray!: any;
  movieDetails: any[] = [];
  showSuccessMessage: boolean = false;
  collections: any;
  selectedCollection: any;
  collectionsMovies: any;
  flagExists: boolean = false;
  selectedCollectionTitle!: string;
  hasCollections: boolean = false;
  constructor(private router: Router, private movieService: MoviesService) { }
  ngOnInit() {
    if (this.idArray) {
      console.log("id on init", this.idArray);
      if (this.idArray.length === 1) {
        this.movieService.getMovieDetails(this.idArray).subscribe(
          (movieDetails) => {
            this.movieDetails = [movieDetails];
            console.log('movie details for collection with 1 selected:', this.movieDetails);
          });
      } else {
        // for (const idA of this.idArray) {
        //   console.log("id [] on init:",idA);
        //   this.movieService.getMovieDetails(idA).subscribe(
        //     (movieDetails) => {
        //       this.movieDetails.push(movieDetails);
        //       console.log('movie details for collection with many selected:', this.movieDetails);
        //     });
        // }
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
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.idArray) {
      console.log('changes id collcetion:', changes);
      if (changes['idArray']) {
        console.log("length/number of changes:", changes['idArray'].currentValue.length);
        console.log("changes that pop up gets", changes['idArray'].currentValue);
        if (changes['idArray'].currentValue.length === 1) {
          console.log("1 movie id changed:", changes['idArray'].currentValue);
          this.movieService.getMovieDetails(changes['idArray'].currentValue).subscribe(
            (movieDetails) => {
              this.movieDetails = [movieDetails];
              console.log('changed movie details for collection with 1 selected:', this.movieDetails);
            });
        } else if (changes['idArray'].currentValue.length > 1) {
          // console.log('change id collection many selected:', changes['idArray'].currentValue);
          // this.idArray = changes['idArray'].currentValue; //if the value of id has changed set the current value to id
          // for (const idA of this.idArray) {
          //   console.log("id list change", idA);
          //   this.movieService.getMovieDetails(idA).subscribe(
          //     (movieDetails) => {
          //         this.movieDetails.push(movieDetails);
          //         console.log('changed movie details for collection with many selected:', this.movieDetails);
          //       }
          //     );
          // }
        }
      }
    }
  }
  addToCollection(title: string) {
    console.log("add movie id", this.idArray);
    console.log("to collection:", title);
    this.selectedCollectionTitle = title;
    this.selectedCollection = this.collections.filter((item: any) => item.title === title);
    console.log("selected collection:", this.selectedCollection);
    for (const detail of this.selectedCollection) {
      if (detail.moviesList.length > 0) {
        for (let i of this.idArray) {
          this.movieService.getMovieDetails(i).subscribe(
            (movieDetails) => {
              detail.moviesList.push(movieDetails);
              localStorage.setItem("Collections", JSON.stringify(this.collections));
            });
        }
        console.log("Movie added to moviesList existing:", detail.moviesList);
        console.log("selected collection existing:", this.selectedCollection);
        console.log("saved collections existing:", this.collections);
        this.showSuccessMessage = true;
        this.flagExists = false;
        setTimeout(() => {
          this.showSuccessMessage = false; //timeout to auto dismiss after certain time
        }, 5000);
      }
      else {
        if (this.idArray.length === 1) {
          this.movieService.getMovieDetails(this.idArray).subscribe(
            (movieDetails) => {
              detail.moviesList = [movieDetails];
              localStorage.setItem("Collections", JSON.stringify(this.collections));
            });
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false; //timeout to auto dismiss after certain time
          }, 5000);
          console.log("1st Movie added to moviesList:", detail.moviesList);
          console.log("selected collection 1st:", this.selectedCollection);
          console.log("saved collections 1st:", this.collections);
        } else {
          for (let i of this.idArray) {
            this.movieService.getMovieDetails(i).subscribe(
              (movieDetails) => {
                detail.moviesList.push(movieDetails);
                localStorage.setItem("Collections", JSON.stringify(this.collections));
              });
            this.showSuccessMessage = true;
            setTimeout(() => {
              this.showSuccessMessage = false; //timeout to auto dismiss after certain time
            }, 5000);
            console.log("1st time many Movies added to moviesList:", detail.moviesList);
            console.log("1st time many Movies selected collection:", this.selectedCollection);
            console.log("1st time many Movies saved collections:", this.collections);
          }
        }
      }
    }
  }
}

