import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { PlaylistService } from 'src/app/services/playlist.service';
import { PlaylistDetails, Review } from 'src/app/interfaces/playlist-details';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  username = '';
  userID = '';
  accessToken = '';
  API_ACCESS_TOKEN = '';
  existingUserList: any = [];
  existingPlayList: any = [];
  review: Review[] | undefined = [];

  adminRoles = 'rol_Z8f96r3xWKLviy7h';

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private toastrService: ToastrService,
    private playlistService: PlaylistService
  ) {
    auth.user$.subscribe((u) => {
      //This is the current login username
      this.username = JSON.stringify(u?.preferred_username);
      this.userID = u?.sub?.toString() ? u?.sub?.toString() : '';
    });

    this.auth.getAccessTokenSilently().subscribe((token) => {
      //This is the access token of the current login user
      this.accessToken = token;
    });
  }

  blockDesignatedUserById(userId: string) {
    if (confirm('Are you sure to deactivated this user?')) {
      this.blocked(userId, true);
    }
  }

  unblockDesignatedUserById(userId: string) {
    if (confirm('Are you sure to activated this user?')) {
      this.blocked(userId, false);
    }
  }

  assignRoleToDesignatedUserById(userId: string) {
    if (confirm('Are you sure to assign Admin Role to this user?')) {
      this.assignAdminToUser(userId, this.adminRoles);
    }
  }

  removeRoleToDesignatedUserById(userId: string) {
    if (confirm('Are you sure to remove Admin Role from this user?')) {
      this.removeAdminFromUser(userId, this.adminRoles);
    }
  }

  blocked(blockUserId: string, status: boolean) {
    const url = 'http://localhost:3000/api/api/blockedUser/';
    const body = {
      userId: blockUserId,
      blockStatus: status,
    };

    try {
      this.http.patch(url, body).subscribe((_) => {
        //Toaster message goes here
        if (status) {
          this.toastrService.success('Deactivation Operation Successful!');
        } else {
          this.toastrService.success('Activation Operation Successful!');
        }
      });
    } catch (err) {
      this.toastrService.error('Operation Failed');
    }
  }

  getAllExistingUsers() {
    const url = 'http://localhost:3000/api/api/retrieveUsers/';
    this.http.get(url).subscribe((s) => {
      this.existingUserList = s;
      for (let i = 0; i < this.existingUserList.length; i++) {
        if (this.existingUserList[i].username === 'administrator') {
          this.existingUserList.splice(i, 1);
        }
      }
    });
  }

  displayNameAndReviewOfAllPlayList() {
    this.playlistService.getAllPlayList().then((t) => {
      this.existingPlayList = t;
    });
  }

  setReviewStatus(reviewId: string, reviewStatus: boolean) {
    try{
      this.playlistService.reviewState(reviewId, reviewStatus).then((_) => {
        if(reviewStatus){
          this.toastrService.success('Hide Review Operation Successful!');
        }else{
          this.toastrService.success('Show Review Operation Successful!');
        }
      });
    }catch (err) {
      this.toastrService.error('Operation Failed');
    }

  }

  assignAdminToUser(assignUserId: string, roles: string) {
    const url = 'http://localhost:3000/api/api/assignAdmin/';

    const body = {
      userId: assignUserId,
      adminRolesId: roles,
    };
    try {
      this.http.post(url, body).subscribe((_) => {
        this.toastrService.success('Assignment Operation Successful');
      });
    } catch (err) {
      this.toastrService.error('Operation Failed');
    }
  }

  removeAdminFromUser(removeUserId: string, roles: string) {
    const url = 'http://localhost:3000/api/api/removeAdmin/';
    const options = {
      body: {
        userId: removeUserId,
        adminRolesId: roles,
      },
    };
    try {
      this.http.delete(url, options).subscribe((_) => {
        //Toaster message goes here
        this.toastrService.success('Remove Operation Successful');
      });
    } catch (err) {
      this.toastrService.error('Operation Failed');
    }
  }

  parseUsername(username: string) {
    return username.replaceAll('"', '');
  }
}
