import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private apiKey = '406879b276e4c4eb3b07000ad7ddbc12';
  private apiUrl = ' https://api.themoviedb.org/3/search/movie';
  private movieUrl = ' https://api.themoviedb.org/3/movie';
  private movieGenreUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
  private trendingUrl = 'https://api.themoviedb.org/3/trending/movie'
  constructor(private http: HttpClient) { }
  getMoviebyQuery(query: string, page: number = 1) {
    const url = `${this.apiUrl}?query=${query}&api_key=${this.apiKey}&page=${page}`;
    return this.http.get<any>(url);
  }
  getMovieDetails(id: any) {
    const url = `${this.movieUrl}/${id}?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  getGenres() {
    const url = `${this.movieGenreUrl}&api_key=${this.apiKey}`;
    return this.http.get(url);
  }
  // private genreMoviesUrl = 'https://api.themoviedb.org/3/discover/movie?page=1&with_genres';
  // getMoviesByGenres(genre:string){
  //   const url = `${this.genreMoviesUrl}=${genre}&api_key=${this.apiKey}`;
  //   return this.http.get(url);
  // }
  private nowPlayingUrl = 'https://api.themoviedb.org/3/movie/now_playing';
  getNowMovies(region: any, page: number) {
    const url = `${this.nowPlayingUrl}?page=${page}&region=${region}&api_key=${this.apiKey}`;
    return this.http.get(url);
  }
  getTrending(time:string, page: number) {
    const url = `${this.trendingUrl}/${time}?page=${page}&api_key=${this.apiKey}`;
    return this.http.get(url);
  }
}
