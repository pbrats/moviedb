import { Component } from '@angular/core';
import { MoviesService } from '../../service/movies.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
  constructor(private router: Router, private movieService: MoviesService, private formBuilder: FormBuilder) { }
  ngOnInit() {
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
    this.loadTrending(this.time, 1);
    this.selectForm = this.formBuilder.group({
      selectedRegion: ['gr']
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
  showAll(value: any) {
    console.log("region: ", value)
    this.router.navigate(['now-playing'], { queryParams: { region: value } });
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
}
