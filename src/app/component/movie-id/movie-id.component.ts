import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../service/movies.service';
import { SessionService } from '../../service/session.service';
import { Title } from '@angular/platform-browser';
import { CollectionsPopupComponent } from '../collections-popup/collections-popup.component';

@Component({
  selector: 'app-movie-id',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CollectionsPopupComponent],
  templateUrl: './movie-id.component.html',
  styleUrl: './movie-id.component.css'
})
export class MovieIdComponent {
  idSelected: any;
  movieDetails: any = {};
  sessionInfos: any;
  ratingForm!: FormGroup;
  rating: number = 0;
  response: any;
  sessionId: string = '';
  showSuccessMessage: boolean = false;
  hasLoadedmovie: boolean = false;
  selectedId!: number;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private movieService: MoviesService, private sesService: SessionService, private titleService: Title) { }
  ngOnInit() {
    this.setFormValues();
    // this.sessionId = JSON.stringify(sessionStorage.getItem("SessionId")).replace(/"/g, "").replace(/\\/g, "");
    // console.log("session id from session storage:", this.sessionId);
    this.sessionInfos = sessionStorage.getItem("SessionInfos");
    console.log("session infos from session storage:", this.sessionInfos);
    // Parse the stored JSON string back into an object
    let temp = JSON.parse(this.sessionInfos);
    console.log(temp);
    this.sessionId = temp.guest_session_id;
    console.log("session id from session storage:", this.sessionId);
    this.activatedRoute.params.subscribe(
      (params: any) => {
        console.log("params:", params);
        this.idSelected = params['id'];
        console.log("id selected:", this.idSelected);
      });
    this.movieService.getMovieDetails(this.idSelected).subscribe({
      next: data => {
        setTimeout(() => {

          this.movieDetails = data;
          this.titleService.setTitle(`${this.movieDetails.original_title}`);
          console.log("params movie details", this.movieDetails);
          this.hasLoadedmovie = true;
        }, 0);
      }, error: err => {
        console.log("error", err);
        console.error('Failed to retrieve movie details:', err.error.status_message);
        this.router.navigate(["not-found"]);
      }
    });
  }
  setFormValues() {
    this.ratingForm = new FormGroup({
      rating: new FormControl("", Validators.required)
    });
  }
  onSubmit() {
    this.rating = this.ratingForm.get("rating")?.value;
    console.log("rating:", this.rating);
    console.log("id rating:", this.idSelected);
    console.log("sessionId on Submit:", this.sessionId);
    if (this.sessionId && this.ratingForm.valid) {
      this.rateMovie();
    }
    sessionStorage.setItem('hasRated', 'yes');
  }
  rateMovie() {
    this.sesService.rateMovie(this.idSelected, this.rating, this.sessionId)
      .subscribe((response: any) => {
        this.response = response;
        console.log('Movie rated successfully!', response);
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false; //timeout to auto dismiss after certain time
        }, 5000);
      }, error => {
        console.error('Failed to rate movie:', error);
      });
  }
  addToCollection(id: number) {
    this.selectedId = id
    console.log('movie id to add to collection :', id);
  }
}