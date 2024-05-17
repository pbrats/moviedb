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
  genres:any;
  hasLoadedGenres: boolean = false;
  // hasLoadedGenresMovies: boolean = false;
  hasLoadedNowMovies: boolean = false;
  // genrequery='action';
  // genreMovies: any;
  nowMovies: any;
  region: string = 'gr';
  selectForm!: FormGroup;
  searchForm!: FormGroup;
  searchQuery: string = '';
  constructor(private router: Router, private movieService: MoviesService, private formBuilder: FormBuilder){}
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
// this.movieService.getMoviesByGenres(this.genrequery).subscribe({
//   next: genreMovies => {
//     setTimeout(() => {
//       this.genreMovies = genreMovies;
//       this.hasLoadedGenresMovies = true;
//       console.log(genreMovies);
//     }, 0);
// }
// });
this.loadNowMovies(this.region,1);
this.selectForm = this.formBuilder.group({
  selectedRegion: ['gr']
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
loadNowMovies(region:string, page:number){
  this.movieService.getNowMovies(region,page).subscribe({
    next: nowMovies => {
      setTimeout(() => {
        this.nowMovies = nowMovies;
        this.hasLoadedNowMovies = true;
        console.log(nowMovies);
      }, 0);
  }
  });
}
onSelection(event: any) {
  console.log('Selected value :', event.target.value);
  this.region=event.target.value;
  console.log(typeof(this.region));
  this.loadNowMovies(this.region,1);
  
}
showAll(value: any) {
console.log("region: ",value)
this.router.navigate(['now-playing'],{ queryParams: { region: value} });
}

}
