import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  username = '';

  constructor(private http: HttpClient, public auth: AuthService) {
    this.auth.user$.subscribe((u) => {
      //This is the current login username
      this.username = u?.preferred_username
        ? u?.preferred_username
        : 'notLoggedIn';
    });
  }

  getCurrentUser(): string {
    // console.log('getCurrentUser', this.username);
    return this.username;
  }
}
