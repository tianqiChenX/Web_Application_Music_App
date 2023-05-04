import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { PlaylistDetails } from 'src/app/interfaces/playlist-details';
import { TrackDetails } from 'src/app/interfaces/track-details';
import { PlaylistService } from 'src/app/services/playlist.service';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-add-track',
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.css'],
})
export class AddTrackComponent {
  @Input() visible = false;
  @Input() playlist?: PlaylistDetails;

  results: TrackDetails[] = [];
  resultsNotFound = false;

  accessToken = '';

  constructor(
    private playlistService: PlaylistService,
    private trackService: TrackService,
    public router: Router,
    public auth: AuthService
  ) {
    this.auth.getAccessTokenSilently().subscribe((token) => {
      //This is the access token of the current login user
      this.accessToken = token;
    });
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  async searchTrack(searchText: string) {
    // console.log('search', searchText);
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

  async addToPlaylist(trackId: string) {
    if (!trackId) return;

    if (confirm(`Are you sure to add this track?`)) {
      let ids = this.playlist?.track_ids;
      ids?.push(trackId);
      let updated = '' + ids?.join(',');

      await this.playlistService
        .updateTracksOfPlaylist(this.playlist?.list_name, updated, this.accessToken)
        .catch((err) => {
          console.log('err', err.message);
        });

      window.location.reload();
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router
      //     .navigate([`/personalPlaylist/${this.playlist?.list_name}`])
      //     .then(() => {
      //       console.log(`After navigation I am on:${this.router.url}`);
      //     });
      // });
    }
  }
}
