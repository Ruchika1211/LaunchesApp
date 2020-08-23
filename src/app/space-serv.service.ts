import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpaceServService {

  constructor(private http: HttpClient) { }

  getFilters() {
    return this.http.get('assets/filters.json')
      .pipe(map(result => result));
  }

  getLaunches(queryParams) {
    return this.http.get(`${environment.baseUrl}v3/launches?${queryParams}`)
      .pipe(map(result => result));

  }

  setItem(item, value) {
    window.localStorage.setItem(item, value);
  }

  getItem(item) {
    return window.localStorage.getItem(item);
  }
}
