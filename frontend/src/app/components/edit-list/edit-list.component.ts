import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css'],
})
export class EditListComponent {
  @Input() listName = '';
  @Input() username = '';
  @Input() visible = false;
  accessToken = '';

  constructor(
    private playlistService: PlaylistService,
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

  // edit playlist
  async editPlaylist(pList: {
    listName: string;
    description: string;
    isPublic: boolean;
  }) {
    if (pList.listName.length) {
      await this.playlistService
        .updatePlayListName(this.listName, pList.listName, this.accessToken)
        .catch((err) => {
          console.log('err', err.message);
        });
      this.listName = pList.listName;
    }

    if (pList.description.length) {
      await this.playlistService
        .updatePlayListDes(this.listName, pList.description, this.accessToken)
        .catch((err) => {
          console.log('err', err.message);
        });
    }

    await this.playlistService
      .updatePlayListVis(this.listName, pList.isPublic ? true : false, this.accessToken)
      .catch((err) => {
        console.log('err', err.message);
      });

    window.location.reload();

    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([`/personalPlaylist/${this.listName}`]).then(() => {
    //     console.log(`After navigation I am on:${this.router.url}`);
    //   });
    // });
  }
}
