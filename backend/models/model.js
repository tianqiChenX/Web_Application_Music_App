const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
    genre_id: String,
    "#tracks": String,
    parent: String,
    title: String,
    top_level: String,
});

const artistSchema = new mongoose.Schema({
    artist_id: String,
    artist_active_year_begin: String,
    artist_bio: String,
    artist_comments: String,
    artist_contact: String,
    artist_date_created: String,
    artist_favorites: String,
    artist_handle: String,
    artist_image_file: String,
    artist_images: String,
    artist_latitude: String,
    artist_location: String,
    artist_longitude: String,
    artist_members: String,
    artist_name: String,
    artist_related_projects: String,
    artist_url: String,
    artist_website: String,
    tags: String,
});

const albumSchema = new mongoose.Schema({
    album_id: String,
    album_comments: String,
    album_date_created: String,
    album_date_released: String,
    album_engineer: String,
    album_favorites: String,
    album_handle: String,
    album_image_file: String,
    album_images: String,
    album_information: String,
    album_listens: String,
    album_producer: String,
    album_title: String,
    album_tracks: String,
    album_type: String,
    album_url: String,
    artist_name: String,
    artist_url: String,
    tages: String,
});

const trackSchema = new mongoose.Schema({
    track_id: String,
    album_id: String,
    album_title: String,
    album_url: String,
    artist_id: String,
    artist_name: String,
    artist_url: String,
    artist_website: String,
    license_image_file: String,
    license_image_file_large: String,
    license_parent_id: String,
    license_title: String,
    license_url: String,
    tags: String,
    track_bit_rate: String,
    track_comments: String,
    track_date_created: String,
    track_date_recorded: String,
    track_disc_number: String,
    track_duration: String,
    track_explicit: String,
    track_favorites: String,
    track_file: String,
    track_genres: String,
    track_image_file: String,
    track_instrumental: String,
    track_interest: String,
    track_language_code: String,
    track_listens: String,
    track_number: String,
    track_title: String,
    track_url: String,
});

const reviewSchema = new mongoose.Schema({
    // _id: String,
    commenter: String,
    rating: Number,
    comment: String,
    comment_date: String,
    hidden: Boolean,
});

const playListSchema = new mongoose.Schema({
    list_name: { type: String, required: true },
    list_creator: String,
    last_modified_date: String,
    description: String,
    track_ids: [String],
    public: { type: Boolean, default: false },
    reviews: [reviewSchema],
});

const modifyPolicySchema = new mongoose.Schema(
    {
        policy_name: String,
        policy_content: String
     

    }
)
module.exports.Genres = mongoose.model("Genres", genresSchema);
module.exports.Artist = mongoose.model("Artist", artistSchema);
module.exports.Album = mongoose.model("Album", albumSchema);
module.exports.Track = mongoose.model("Track", trackSchema);

module.exports.PlayList = mongoose.model("PlayList", playListSchema);

module.exports.ModifyPolicy = mongoose.model("ModifyPolicy", modifyPolicySchema);
module.exports.Reviews = mongoose.model("Reviews", reviewSchema);
