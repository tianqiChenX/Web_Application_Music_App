import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  CREATE_PLATLIST,
  DELETE_PLATLIST,
  GET_PLAYLIST_BY_NAME,
  GET_PLAYLIST_BY_NAME_SECURE,
  GET_SUMMARY_OF_LISTS_SECURE,
  GET_SUMMARY_OF_PUBLIC_LISTS,
  GET_TRACKS_FROM_PLAYLIST,
  EDIT_PLATLIST_NAME,
  EDIT_PLATLIST_DES,
  EDIT_PLATLIST_VISIBILITY,
  ADD_REVIEW,
  SAVE_LIST,
  GET_ALL_PLAYLIST,
  HIDE_REVIEW,
} from '../constants/urls';
import { PlaylistDetails, Review } from '../interfaces/playlist-details';
import { PlaylistSummary } from '../interfaces/playlist-summary';
import { TrackDetails } from '../interfaces/track-details';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(private http: HttpClient) {}

  // open apis
  async getSummaryOfPublicPlaylist() {
    let r = await firstValueFrom(
      this.http.get<PlaylistSummary[]>(GET_SUMMARY_OF_PUBLIC_LISTS)
    );
    return r;
  }

  async getAllPlayList() {
    let r = await firstValueFrom(
      this.http.get<PlaylistDetails>(GET_ALL_PLAYLIST)
    );
    return r;
  }

  async reviewState(hiddenReviewId: string, state: boolean) {
    const body = {
      reviewId: hiddenReviewId,
      newStatus: state,
    };
    let r = await firstValueFrom(this.http.put<Review>(HIDE_REVIEW, body));
    return r;
  }

  async getPlaylistByName(listName: string) {
    let r = await firstValueFrom(
      this.http.get<PlaylistDetails>(GET_PLAYLIST_BY_NAME + listName)
    );
    return r;
  }

  async getTracksFromPlaylist(ids: string) {
    let r = await firstValueFrom(
      this.http.get<TrackDetails[]>(GET_TRACKS_FROM_PLAYLIST + ids)
    );
    return r;
  }

  // secure apis
  async getSummaryOfPlaylistByUser(user: string, userToken: string) {
    let r_options = {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${userToken}`,
      },
    };

    let r = await firstValueFrom(
      this.http.get<PlaylistSummary[]>(
        GET_SUMMARY_OF_LISTS_SECURE + user,
        r_options
      )
    );
    return r;
  }

  async getPlaylistByNameByUser(listName: string, userToken: string) {
    let r_options = {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${userToken}`,
      },
    };

    let r = await firstValueFrom(
      this.http.get<PlaylistDetails>(
        GET_PLAYLIST_BY_NAME_SECURE + listName,
        r_options
      )
    );
    return r;
  }

  async createPlayList(
    listName: string,
    creator: string,
    description: string,
    isPublic: boolean,
    userToken: string
  ) {
    let rBody = {
      name: listName,
      creator: creator,
      description: description,
      public: isPublic,
    };

    let r_options = {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${userToken}`,
      },
    };

    let r = await firstValueFrom(
      this.http.post(CREATE_PLATLIST, rBody, r_options)
    );
    return r;
  }

  async removePlayList(listName: string, userToken: string) {
    let rBody = {
      name: listName,
    };

    let r = await firstValueFrom(
      this.http.delete(DELETE_PLATLIST, {
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          authorization: `Bearer ${userToken}`,
        },
        body: rBody,
      })
    );
    return r;
  }

  async updatePlayListName(
    listName: string,
    newName: string,
    userToken: string
  ) {
    let rBody = {
      name: listName,
      newName: newName,
    };

    let r_options = {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${userToken}`,
      },
    };

    let r = await firstValueFrom(
      this.http.put(EDIT_PLATLIST_NAME, rBody, r_options)
    );
    return r;
  }

  async updatePlayListDes(listName: string, des: string, userToken: string) {
    let rBody = {
      name: listName,
      description: des,
    };

    let r_options = {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${userToken}`,
      },
    };

    let r = await firstValueFrom(
      this.http.put(EDIT_PLATLIST_DES, rBody, r_options)
    );
    return r;
  }

  async updatePlayListVis(
    listName: string,
    isPublic: boolean,
    userToken: string
  ) {
    let rBody = {
      name: listName,
      isPublic: isPublic,
    };

    let r_options = {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${userToken}`,
      },
    };

    let r = await firstValueFrom(
      this.http.put(EDIT_PLATLIST_VISIBILITY, rBody, r_options)
    );
    return r;
  }

  async addReview(listName: string, review: Review, userToken: string) {
    let rBody = {
      name: listName,
      commenter: review.commenter,
      rating: review.rating,
      comment: review.comment,
    };

    let r_options = {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${userToken}`,
      },
    };

    let r = await firstValueFrom(this.http.put(ADD_REVIEW, rBody, r_options));
    return r;
  }

  async updateTracksOfPlaylist(
    listName: string | undefined,
    trackIds: string | undefined,
    userToken: string
  ) {
    if (!listName || !trackIds) return;

    let rBody = {
      name: listName,
      ids: trackIds,
    };

    let r_options = {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${userToken}`,
      },
    };

    let r = await firstValueFrom(this.http.put(SAVE_LIST, rBody, r_options));
    return r;
  }
}
