import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistDetails, Review } from 'src/app/interfaces/playlist-details';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Location } from '@angular/common';
import { TrackDetails } from 'src/app/interfaces/track-details';
import { YOUTUBE_SEARCH_URL } from 'src/app/constants/urls';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css'],
})
export class PlaylistDetailComponent implements OnInit {
  currentUser: string = '';
  playlist?: PlaylistDetails;
  tracks?: TrackDetails[];
  avgRating: string = '0';
  reviews?: Review[];
  resultsNotFound = false;

  constructor(
    private playlistService: PlaylistService,
    activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    activatedRoute.params.subscribe((params) => {
      this.currentUser = params['username'];
      this.getPlaylistByName(params['listName']);
    });
  }

  ngOnInit(): void {
    console.log('user: ', this.currentUser);
  }

  back() {
    this.location.back();
  }

  async getPlaylistByName(listName: string) {
    this.resultsNotFound = false;

    if (!listName) return;

    await this.playlistService
      .getPlaylistByName(listName)
      .then((res) => {
        let pl = JSON.parse(JSON.stringify(res).slice(1, -1));

        // convert timestamp
        let d = new Date(Number(pl.last_modified_date));
        pl.last_modified_date = d.toString();
        this.playlist = pl;
      })
      .catch((err) => {
        console.log('err', err.message);
        this.resultsNotFound = true;
      });

    let ids = this.playlist?.track_ids?.join(',');
    if (ids)
      await this.getTracksByPlayList(ids).catch((err) => {
        console.log('err', err.message);
        this.resultsNotFound = true;
      });

    // parse reviews
    // console.log('reviews', this.playlist?.reviews);
    this.parseReviews(this.playlist?.reviews);
  }

  async getTracksByPlayList(ids: string) {
    this.resultsNotFound = false;

    if (!ids) return;

    this.tracks = [];

    await this.playlistService
      .getTracksFromPlaylist(ids)
      .then((ts) => {
        ts.forEach((t) => {
          let detail = JSON.parse(JSON.stringify(t).slice(1, -1));
          this.tracks?.push(detail);
          // console.log('tracks1 :>> ', this.tracks);
        });
      })
      .catch((err) => {
        console.log('err', err.message);
        this.resultsNotFound = true;
      });

    // console.log('tracks2 :>> ', this.tracks);
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

  parseReviews(reviews: Review[] | undefined) {
    if (!reviews || reviews.length < 1) return;

    let rating = 0;
    reviews.forEach((r) => {
      rating += Number(r.rating);
    });

    rating = rating / reviews.length;
    this.avgRating = rating.toFixed(1);

    this.reviews = reviews;
  }
}
