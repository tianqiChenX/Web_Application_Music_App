import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
})
export class CreateListComponent {
  @Input() username = '';
  @Input() visible = false;
  accessToken = '';

  constructor(
    private playlistService: PlaylistService,
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

  // create playlist
  async createPlaylist(pList: {
    listName: string;
    description: string;
    isPublic: boolean;
  }) {
    await this.playlistService
      .createPlayList(
        pList.listName,
        this.username,
        pList.description,
        pList.isPublic ? true : false,
        this.accessToken
      )
      .catch((err) => {
        console.log('err', err.message);
      });

    window.location.reload();
  }
}
