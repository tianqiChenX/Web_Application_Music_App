import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistSummary } from 'src/app/interfaces/playlist-summary';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlists-list',
  templateUrl: './playlists-list.component.html',
  styleUrls: ['./playlists-list.component.css'],
})
export class PlaylistsListComponent implements OnInit {
  @Input() currentUser: any;
  playlistSummarys: PlaylistSummary[] = [];

  constructor(private playlistService: PlaylistService) {
    this.getPlaylistSummary();
  }

  ngOnInit(): void {
    // console.log('Current user in PlaylistsListComponent', this.currentUser);
  }

  async getPlaylistSummary() {
    this.playlistSummarys = [];

    await this.playlistService
      .getSummaryOfPublicPlaylist()
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

    // console.log('playlists', this.playlistSummarys);
  }
}
