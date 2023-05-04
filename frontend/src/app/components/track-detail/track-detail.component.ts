import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YOUTUBE_SEARCH_URL } from 'src/app/constants/urls';
import { TrackDetails } from 'src/app/interfaces/track-details';
import { TrackService } from 'src/app/services/track.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.css'],
})
export class TrackDetailComponent {
  track?: TrackDetails;
  resultsNotFound = false;

  constructor(
    private trackService: TrackService,
    activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    activatedRoute.params.subscribe((params) => {
      this.getTrack(params['trackId']);
    });
  }

  async getTrack(trackId: string) {
    this.resultsNotFound = false;

    if (!trackId) return;

    await this.trackService
      .getTrackById(trackId)
      .then((res) => {
        let t = JSON.parse(JSON.stringify(res).slice(1, -1));
        this.track = t;
      })
      .catch((err) => {
        console.log('err', err.message);
        this.resultsNotFound = true;
      });
  }

  parseGenres(genres: string): string[] {
    genres = genres.replaceAll("'", '"');
    let res: string[] = [];

    type GenresType = {
      genre_id: string;
      genre_title: string;
      genre_url: string;
    };

    let genres_obj: GenresType[] = JSON.parse(genres);

    genres_obj.forEach((e) => {
      res.push(e.genre_title);
    });

    // console.log('result', res);
    return res;
  }

  searchOnYouTube(title: string) {
    let searchUrl = YOUTUBE_SEARCH_URL + title;
    window.open(searchUrl, '_blank');
  }

  back() {
    this.location.back();
  }
}
