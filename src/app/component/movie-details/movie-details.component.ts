import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MoviesService } from '../../service/movies.service';
import { SessionService } from '../../service/session.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent {
  @Input() id!: number;
  movieDetails: any = {};
  hasLoadedmovie: boolean = false;
  ratingForm!: FormGroup;
  rating: number = 0;
  response: any;
  sessionInfos: any;
  sessionId: string = '';
  showSuccessMessage: boolean = false;
  errorFlag: boolean = false;
  errorMessage: any;

  constructor(private router: Router, private movieService: MoviesService, private sesService: SessionService, private modalService: NgbModal, private titleService: Title) { }
  ngOnInit() {
    //sessionId is saved on search movie if user goes directly to collections without searching cannot rate without sessionId info the movies that exist in stored collections
    // this.sessionId = JSON.stringify(sessionStorage.getItem("SessionId")).replace(/"/g, "").replace(/\\/g, ""); 
    const infos = sessionStorage.getItem('SessionInfos');
    if (infos !== null) {
      this.sessionInfos = JSON.parse(infos);
      console.log("session infos from session storage:", this.sessionInfos);
    }
    this.setFormValues();
    if (this.id) {
      console.log('id modal', this.id);
      this.movieService.getMovieDetails(this.id).subscribe({
        next: movieDetails => {
          setTimeout(() => {
            this.movieDetails = movieDetails;
            this.titleService.setTitle(`${this.movieDetails.original_title}`);
            console.log('movie details', this.movieDetails);
            this.hasLoadedmovie = true;
          }, 0);
        }, error: err => {
          console.log("error", err);
          console.error('Failed to retrieve movie details:', err.error.status_message);
          this.errorMessage = err.error.status_message;
          this.errorFlag = true;
        }
      });
    }
  }
  setFormValues() {
    this.ratingForm = new FormGroup({
      rating: new FormControl("", Validators.required)
    });
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   if (this.id) {
  //     console.log('changes:', changes);
  //     if (changes['id']) {
  //       console.log('change id :', changes['id'].currentValue);
  //       this.id = changes['id'].currentValue; //if the value of id has changed set the current value to id
  //       this.movieService.getMovieDetails(this.id).subscribe((movieDetails) => {
  //         this.movieDetails = movieDetails;
  //         console.log('new movie details with changed id', this.movieDetails);
  //       });
  //     }
  //   }
  // }
  onSubmit() {
    this.sessionId = this.sessionInfos.guest_session_id;
    console.log("session Id:", this.sessionId);
    this.rating = this.ratingForm.get("rating")?.value;
    console.log("rating:", this.rating);
    console.log("id rating:", this.id);
    console.log("sessionId on Submit:", this.sessionId);
    if (this.sessionId && this.ratingForm.valid) {
      this.rateMovie();
    }
    sessionStorage.setItem('hasRated', 'yes');
  }
  rateMovie() {
    this.sesService.rateMovie(this.id, this.rating, this.sessionId)
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
}