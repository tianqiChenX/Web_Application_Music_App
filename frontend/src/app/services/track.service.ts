import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GET_TRACKS_BY_SEARCH_NAME, GET_TRACK_BY_ID } from '../constants/urls';
import { TrackDetails } from '../interfaces/track-details';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  constructor(private http: HttpClient) {}

  async getTracksBySearchName(searchText: string) {
    let r = await firstValueFrom(
      this.http.get<TrackDetails[]>(GET_TRACKS_BY_SEARCH_NAME + searchText)
    );
    return r;
  }

  async getTrackById(id: string) {
    let r = await firstValueFrom(
      this.http.get<TrackDetails>(GET_TRACK_BY_ID + id)
    );
    return r;
  }
}
