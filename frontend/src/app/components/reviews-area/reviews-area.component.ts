import { Component, INJECTOR, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Review } from 'src/app/interfaces/playlist-details';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-reviews-area',
  templateUrl: './reviews-area.component.html',
  styleUrls: ['./reviews-area.component.css'],
})
export class ReviewsAreaComponent implements OnInit {
  @Input() listName: string = '';
  @Input() username: string = '';
  @Input() reviews: Review[] = [];
  @Input() visible = false;
  @Input() loggedIn = false;
  rates: string[] = ['1', '2', '3', '4', '5'];
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

  ngOnInit(): void {
    this.loggedIn = !this.username.includes('notLoggedIn');
    // console.log('init', this.username, !(this.username.includes('notLoggedIn')));
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  async addReview(review: Review) {
    review.commenter = this.username;

    await this.playlistService.addReview(
      this.listName,
      review,
      this.accessToken
    );

    window.location.reload();

    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([`/personalPlaylist/${this.listName}`]).then(() => {
    //     console.log(`After navigation I am on:${this.router.url}`);
    //   });
    // });
  }

  parseDate(timestamp: string): string {
    return new Date(Number(timestamp)).toString();
  }
}
