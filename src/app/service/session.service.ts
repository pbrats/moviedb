import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiKey = '85204a8cc33baf447559fb6d51b18313';
  private apiUrl = ' https://api.themoviedb.org/3/authentication/guest_session/new';
  private rateUrl = ' https://api.themoviedb.org/3/movie';
  private seeRateUrl = ' https://api.themoviedb.org/3/guest_session';
  constructor(private http: HttpClient) { }

  getSessionId() {
    const url = `${this.apiUrl}?api_key=${this.apiKey}`;
    return this.http.get(url);
  }
  rateMovie(movieId: number, rating: number,guestSessionId:string): Observable<any> {
    const url = `${this.rateUrl}/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`;
    const body = { value: rating };
    return this.http.post(url, body);
  }
  seeRates(guestSessionId:string) {
    const url = `${this.seeRateUrl}/${guestSessionId}/rated/movies?api_key=${this.apiKey}`;
    return this.http.get(url);
  }
}