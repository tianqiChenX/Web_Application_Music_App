import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TracksListComponent } from './components/tracks-list/tracks-list.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchComponent } from './components/search/search.component';
import { TrackDetailComponent } from './components/track-detail/track-detail.component';
import { PlaylistsListComponent } from './components/playlists-list/playlists-list.component';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';
import { PlaylistsPrivateComponent } from './components/playlists-private/playlists-private.component';
import { FormsModule } from '@angular/forms';
import { CreateListComponent } from './components/create-list/create-list.component';
import { EditablePlaylistComponent } from './components/editable-playlist/editable-playlist.component';
import { EditListComponent } from './components/edit-list/edit-list.component';
import { ReviewsAreaComponent } from './components/reviews-area/reviews-area.component';
import { AddTrackComponent } from './components/add-track/add-track.component';
import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { PolicyComponent } from './components/policy/policy.component';
import { PolicyLinkComponent } from './components/policy-link/policy-link.component';
import { DMCAProcedureComponent } from './components/dmcaprocedure/dmcaprocedure.component';

@NgModule({
  declarations: [
    AppComponent,
    TracksListComponent,
    HeaderComponent,
    HomeComponent,
    NotFoundComponent,
    SearchComponent,
    TrackDetailComponent,
    PlaylistsListComponent,
    PlaylistDetailComponent,
    AuthButtonComponent,
    UserProfileComponent,
    DashboardComponent,
    PlaylistsPrivateComponent,
    CreateListComponent,
    EditablePlaylistComponent,
    EditListComponent,
    ReviewsAreaComponent,
    AddTrackComponent,
    PolicyComponent,
    PolicyLinkComponent,
    DMCAProcedureComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false
    }),
    AuthModule.forRoot({
      domain: 'dev-oew46fjr0voxht7k.us.auth0.com',
      clientId: 'J7Gu1zXm4z8lISi3aP1s9b57mAbOQ0EL',
      audience: 'http://musicapp/api',
      issuer: 'https://dev-oew46fjr0voxht7k.us.auth0.com/',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
