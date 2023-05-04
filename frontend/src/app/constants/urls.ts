const BASE_URL = 'http://localhost:3000/api/';

const OPEN_APIS = "open/";
const SECURE_APIS = "secure/";
const ADMIN_APIS = "admin/";

// track related
export const GET_TRACKS_BY_SEARCH_NAME = BASE_URL + OPEN_APIS + 'getTracksBySearchName/';
export const GET_TRACK_BY_ID = BASE_URL + OPEN_APIS + 'getTrackById/';

// function related
export const YOUTUBE_SEARCH_URL =
  'https://www.youtube.com/results?search_query=';

// playlist related
// get
export const GET_SUMMARY_OF_PUBLIC_LISTS = BASE_URL + OPEN_APIS + 'getSummaryOfLists';
export const GET_PLAYLIST_BY_NAME = BASE_URL + OPEN_APIS + 'getPlayListByName/';
export const GET_TRACKS_FROM_PLAYLIST = BASE_URL + OPEN_APIS + 'getTracksByIds/';

export const GET_SUMMARY_OF_LISTS_SECURE = BASE_URL + SECURE_APIS + 'getSummaryOfLists/';
export const GET_PLAYLIST_BY_NAME_SECURE = BASE_URL + SECURE_APIS + 'getPlayListByName/';

export const GET_ALL_PLAYLIST = BASE_URL + OPEN_APIS + 'getAllPlayList';
export const HIDE_REVIEW = BASE_URL + ADMIN_APIS + 'updateReviewVisibility/';
// post and put
export const CREATE_PLATLIST = BASE_URL + SECURE_APIS + 'createList/';
export const EDIT_PLATLIST_NAME = BASE_URL + SECURE_APIS + 'editListName/';
export const EDIT_PLATLIST_DES = BASE_URL + SECURE_APIS + 'editListDes/';
export const EDIT_PLATLIST_VISIBILITY = BASE_URL + SECURE_APIS + 'editListVisibility/';
export const ADD_REVIEW = BASE_URL + SECURE_APIS + 'addReview/';
export const SAVE_LIST = BASE_URL + SECURE_APIS + 'saveList/';


// delete
export const DELETE_PLATLIST = BASE_URL + SECURE_APIS + 'removeList/';

// policy
export const UPDATE_POLICY = BASE_URL + ADMIN_APIS + 'securityPolicy';
export const UPDATE_AUO = BASE_URL + ADMIN_APIS + 'AUPPolicy';
export const UPDATE_DMCA = BASE_URL + ADMIN_APIS + 'DMCAPolicy';

