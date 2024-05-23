import { Component } from '@angular/core';
import { MoviesService } from '../../service/movies.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../service/session.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  genres: any;
  hasLoadedGenres: boolean = false;
  hasLoadedNowMovies: boolean = false;
  nowMovies: any;
  region: string = 'gr';
  selectForm!: FormGroup;
  select2Form!: FormGroup;
  searchForm!: FormGroup;
  timeForm!: FormGroup;
  time: string = 'day';
  searchQuery: string = '';
  hasLoadedTrending: boolean = false;
  trending: any;
  popular:any;
  hasLoadedPopular: boolean = false;
  top: any;
  hasLoadedTop: boolean = false;
  buttonDay: boolean = true;
  buttonWeek: boolean = false;
  hasLoadedUpcoming: boolean= false;
  upcoming: any;
  region2: string = 'gr';
  sessionInfos: any;
  sessionId: string = '';
  constructor(private router: Router, private movieService: MoviesService, private formBuilder: FormBuilder,  private sesService: SessionService) { }
  ngOnInit() {
    const hasRated = sessionStorage.getItem('hasRated');
    console.log('hasRated', hasRated);
    if (hasRated !== null) {
      const infos = sessionStorage.getItem('SessionInfos');
      if (infos !== null) {
        this.sessionInfos = JSON.parse(infos);
        console.log("this.sessionInfos precreated:", this.sessionInfos);
      }
    } else {
      this.sesService.getSessionId().subscribe((data) => {
        this.sessionInfos = data;
        console.log("this.sessionInfos:", this.sessionInfos);
        sessionStorage.setItem('SessionInfos', JSON.stringify(this.sessionInfos));
      });
      sessionStorage.setItem('hasRated', 'no');
    }
    this.setFormValues();
    this.movieService.getGenres().subscribe({
      next: genres => {
        setTimeout(() => {
          this.genres = genres;
          this.hasLoadedGenres = true;
        }, 0);
      }
    });
    this.loadTop(1);
    this.loadPopular(1);
    this.loadNowMovies(this.region, 1);
    this.loadUpcoming(this.region2, 1);
    this.loadTrending(this.time, 1);
    this.selectForm = this.formBuilder.group({
      selectedRegion: ['gr']
    });
    this.select2Form = this.formBuilder.group({
      selectedRegion2: ['gr']
    });
    this.timeForm = this.formBuilder.group({
      time: ['day']
    });
  }
  setFormValues() {
    this.searchForm = new FormGroup({
      searchData: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.minLength(3)])
    });
  }
  onSubmit() {
    console.log("input value:", this.searchForm.get("searchData")?.value);
    this.searchQuery = this.searchForm.get("searchData")?.value;
    console.log("search query:", this.searchQuery);
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    console.log("session info on submit :", this.sessionInfos);
    this.sessionId = this.sessionInfos.guest_session_id;
    console.log("sessionId:", this.sessionId);
    // save to session storage ths session Id 
    sessionStorage.setItem('SessionId', JSON.stringify(this.sessionId));
  }
  loadNowMovies(region: string, page: number) {
    this.movieService.getNowMovies(region, page).subscribe({
      next: nowMovies => {
        setTimeout(() => {
          this.nowMovies = nowMovies;
          this.hasLoadedNowMovies = true;
          console.log(nowMovies);
        }, 0);
      }
    });
  }
  loadUpcoming(region: string, page: number) {
    this.movieService.getUpcoming(region, page).subscribe({
      next: upcoming => {
        setTimeout(() => {
          this.upcoming = upcoming;
          this.hasLoadedUpcoming = true;
          console.log(upcoming);
        }, 0);
      }
    });
  }
  loadTrending(time:string, page:number){
    this.movieService.getTrending(time, page).subscribe({
      next: trending => {
        setTimeout(() => {
          this.trending = trending;
          this.hasLoadedTrending = true;
          console.log(trending);
        }, 0);
      }
    });
  }
  loadPopular(page:number){
    this.movieService.getPopular(page).subscribe({
      next: popular => {
        setTimeout(() => {
          this.popular = popular;
          this.hasLoadedPopular= true;
          console.log(popular);
        }, 0);
      }
    });
  }
  loadTop(page:number){
    this.movieService.getTop(page).subscribe({
      next: top => {
        setTimeout(() => {
          this.top = top;
          this.hasLoadedTop= true;
          console.log(top);
        }, 0);
      }
    });
  }
  onSelection(event: any) {
    console.log('Selected value :', event.target.value);
    this.region = event.target.value;
    console.log(typeof (this.region));
    this.loadNowMovies(this.region, 1);
  }
  onSelection2(event: any) {
    console.log('Selected value 2 :', event.target.value);
    this.region2 = event.target.value;
    console.log(typeof (this.region2));
    this.loadUpcoming(this.region2, 1);
  }
  showAll(value: any) {
    console.log("region: ", value)
    this.router.navigate(['now-playing'], { queryParams: { region: value } });
  }
  showAll2(value: any) {
    console.log("region: ", value)
    this.router.navigate(['upcoming'], { queryParams: { region: value } });
  }
  showTrending(value: any){
    console.log("time: ", value)
    this.router.navigate(['trending'], { queryParams: { time: value } });
  }
  onClickTime(buttonName: string) {
    this.timeForm.patchValue({
      time: buttonName
    });
    console.log("selected time :", buttonName);
    this.time = buttonName;
    if (buttonName == "day") {
      console.log("button day");
      this.buttonDay= true;
      this.buttonWeek = false;
    } else if (buttonName == "week") {
      console.log("button week");
      this.buttonWeek = true;
      this.buttonDay = false;
    } 
    this.loadTrending(this.time, 1);
  }
  getGenreMovies(name:string, id: number){
    this.router.navigate(["genres", name], { queryParams: { genre: id } } );
  }
  moviePage(id: number) {
    console.log('details id:', id);
    this.router.navigate(['movies', id]);
  }
}
