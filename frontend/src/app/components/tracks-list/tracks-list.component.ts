import { Component } from '@angular/core';
import { TrackDetails } from '../../interfaces/track-details';
import { TrackService } from 'src/app/services/track.service';
import { ActivatedRoute } from '@angular/router';
import { YOUTUBE_SEARCH_URL } from 'src/app/constants/urls';

@Component({
  selector: 'app-tracks-list',
  templateUrl: './tracks-list.component.html',
  styleUrls: ['./tracks-list.component.css'],
})
export class TracksListComponent {
  results: TrackDetails[] = [];
  resultsNotFound = false;

  constructor(
    private trackService: TrackService,
    activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      this.searchTrack(params['searchText']);
    });
  }

  async searchTrack(searchText: string) {
    this.resultsNotFound = false;
    this.results = [];

    if (!searchText) return;

    await this.trackService
      .getTracksBySearchName(searchText)
      .then((ts) => {
        ts.forEach((t) => {
          this.results.push(t);
        });
      })
      .catch((err) => {
        console.log('err', err.message);
        this.resultsNotFound = true;
      });
  }

  parseGenresToString(genres: string): string {
    genres = genres.replaceAll("'", '"');
    let res: string = '';

    type GenresType = {
      genre_id: string;
      genre_title: string;
      genre_url: string;
    };

    let genres_obj: GenresType[] = JSON.parse(genres);

    genres_obj.forEach((e) => {
      res += e.genre_title + ' / ';
    });

    return res.slice(0, -2);
  }

  searchOnYouTube(title: string) {
    let searchUrl = YOUTUBE_SEARCH_URL + title;
    window.open(searchUrl, '_blank');
  }
}
