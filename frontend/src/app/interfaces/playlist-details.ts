export interface PlaylistDetails {
  list_name: string;
  list_creator: string;
  last_modified_date: string;
  description?: string;
  track_ids?: string[];
  public: boolean;
  reviews?: Review[];
}

export interface Review {
  _id: string;
  commenter: string;
  rating: string;
  comment: string;
  comment_date: string;
  hidden: boolean;
}
