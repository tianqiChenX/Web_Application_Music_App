import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { PlaylistSummary } from 'src/app/interfaces/playlist-summary';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlists-private',
  templateUrl: './playlists-private.component.html',
  styleUrls: ['./playlists-private.component.css'],
})
export class PlaylistsPrivateComponent implements OnInit {
  @Input() username: any;
  playlistSummarys: PlaylistSummary[] = [];
  accessToken = '';

  constructor(
    private playlistService: PlaylistService,
    activatedRoute: ActivatedRoute,
    public auth: AuthService
  ) {
    this.auth.getAccessTokenSilently().subscribe((token) => {
      //This is the access token of the current login user
      this.accessToken = token;

      activatedRoute.params.subscribe((params) => {
        this.username = params['username'];
        this.getPlaylistSummaryByUser();
      });
    });
  }

  ngOnInit(): void {
    // console.log('Current user in PlaylistsListComponent', this.username);
  }

  async getPlaylistSummaryByUser() {
    this.playlistSummarys = [];

    // console.log('accessToken', this.accessToken);

    await this.playlistService
      .getSummaryOfPlaylistByUser(this.username, this.accessToken)
      .then((pls) => {
        pls.forEach((pl) => {
          this.playlistSummarys.push(pl);
        });
      })
      .catch((err) => {
        console.log('err', err.message);
      });

    this.playlistSummarys.sort((list1, list2) =>
      list1.last_modified_date < list2.last_modified_date ? 1 : -1
    );
  }

  async deletePlaylist(listName: string) {
    if (confirm(`Are you sure to delete ${listName}`)) {
      await this.playlistService
        .removePlayList(listName, this.accessToken)
        .then((pls) => {
          // console.log('delete', pls);
        })
        .catch((err) => {
          console.log('err', err.message);
        });

      window.location.reload();
      // console.log('delete-confirm', listName);
    } else {
      // console.log('delete-cancel', listName);
    }
  }
}
