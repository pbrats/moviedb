import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../service/session.service';
import { Title } from '@angular/platform-browser';
import { CollectionsPopupComponent } from '../collections-popup/collections-popup.component';
import { MultipleIdsPopupComponent } from '../multiple-ids-popup/multiple-ids-popup.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-rated-movies',
  standalone: true,
  imports: [CommonModule, RouterLink, CollectionsPopupComponent, MultipleIdsPopupComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './rated-movies.component.html',
  styleUrl: './rated-movies.component.css'
})
export class RatedMoviesComponent {
  sessionId!: string;
  rates: any = {};
  hasLoadedresults: boolean = false;
  flag: boolean = false;
  sessionInfos: any;
  selectedId!: number;
  collectionsForm!: FormGroup;
  selectedMoviesId: number[] = [];
  constructor(private router: Router, private sesService: SessionService, private titleService: Title, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Rated movies");
  }
  ngOnInit() {
    const infos = sessionStorage.getItem('SessionInfos');
    if (infos !== null) {
      this.sessionInfos = JSON.parse(infos);
      console.log("session infos from session storage:", this.sessionInfos);
    }
    const hasRated = sessionStorage.getItem('hasRated');
    console.log('hasRated', hasRated);
    if (hasRated === 'yes') {
      this.flag = true;
      console.log("The user has rated movies");
      this.sessionId = this.sessionInfos.guest_session_id;
      console.log("session Id:", this.sessionId);
      if (this.sessionId) {
        this.sesService.seeRates(this.sessionId).subscribe({
          next: data => {
            setTimeout(() => {
              this.rates = data;
              console.log("rates:", this.rates);
              this.hasLoadedresults = true;
            }, 0);
          }
        });
      }
    } else {
      console.log("The user has not rated movies");
    }
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
  moviePage(id: number) {
    console.log('details id:', id);
    this.router.navigate(['movies', id]);
  }
  onMovieClick(id: number) {
    console.log("id collection see:", id);
    //option 1 routes
    this.router.navigate(["search/movies", id]);
    //option 2 routes
    // this.router.navigate(["search", id, "movies"]);
  }
  addToCollection(id: number) {
    this.selectedId = id
    console.log('movie id to add to collection :', id);
  }
}