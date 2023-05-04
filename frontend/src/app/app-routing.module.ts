import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditablePlaylistComponent } from './components/editable-playlist/editable-playlist.component';
import { HomeComponent } from './components/home/home.component';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';
import { PlaylistsPrivateComponent } from './components/playlists-private/playlists-private.component';
import { TrackDetailComponent } from './components/track-detail/track-detail.component';
import { TracksListComponent } from './components/tracks-list/tracks-list.component';
import { PolicyLinkComponent } from './components/policy-link/policy-link.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search/:searchText', component: TracksListComponent },
  { path: 'track/:trackId', component: TrackDetailComponent },
  { path: 'playlist/:listName/:username', component: PlaylistDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'personalPlaylist/:listName/:username', component: EditablePlaylistComponent },
  { path: 'playlistsPrivate/:username', component: PlaylistsPrivateComponent },
  { path: 'policy',component:PolicyLinkComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
