const express = require("express");

const {
  Genres,
  Artist,
  Track,
  PlayList,
  Album,
  Reviews,
  ModifyPolicy
} = require("../models/model");
var ObjectId = require("mongodb").ObjectId;

const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");

// Check Permissions of Users and Admin
const adminPermissionArray = [
  "grant:privilege",
  "mark:deactivated",
  "set:hidden",
];

const userPermissionArray = [
  "add:review",
  "create:playlist",
  "delete:playlist",
  "edit:playlist",
];

const options = {
  customScopeKey: "permissions",
  customUserKey: "auth",
  checkAllScopes: true,
};

const checkAdminPermissions = jwtAuthz(
  adminPermissionArray.concat(userPermissionArray),
  options
);

const checkUserPermissions = jwtAuthz(userPermissionArray, options);

// Configure the library that will validate the access token in API.
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.ISSUER_BASE_URL + `.well-known/jwks.json`,
  }),
  audience: process.env.AUIDENCE,
  issuer: process.env.ISSUER_BASE_URL,
  algorithms: ["RS256"],
});

const router = express.Router();
module.exports = router;
var ObjectId = require("mongodb").ObjectId;
const OPEN_APIS = "/open";
const SECURE_APIS = "/secure";
const ADMIN_APIS = "/admin";

// Block users
router.patch("/api/blockedUser/", function (req, res) {
  let userId = req.body.userId;
  let blockStatus = req.body.blockStatus;

  let url = process.env.ISSUER_BASE_URL + "api/v2/users/" + userId;

  let r_body = {
    blocked: blockStatus,
  };

  let result = "";
  (async () => {
    await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(r_body),
      headers: new Headers({
        "content-type": "application/json; charset=UTF-8",
        authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
      }),
    })
      .then((response) => {
        const res = response.json();
        if (!response.ok) {
          return res.then((r) => {
            return Promise.reject(r);
          });
        }
        return res;
      })
      .then((data) => {
        // console.log(data);
        result = data;
      })
      .catch((err) => {
        console.log("err message", err.message);
      });
  })();
  res.json(result);
});

router.get("/api/retrieveUsers/", async (req, res) => {
  const url =
    process.env.ISSUER_BASE_URL +
    "api/v2/users?sort=username%3A1&fields=username%2Cuser_id";

  let results = [];
  await fetch(url, {
    method: "GET",
    headers: new Headers({
      "content-type": "application/json; charset=UTF-8",
      authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
    }),
  })
    .then((response) => {
      const res = response.json();
      if (!response.ok) {
        return res.then((r) => {
          return Promise.reject(r);
        });
      }
      return res;
    })
    .then((data) => {
      results = data;
    })
    .catch((err) => {
      console.log("err message", err.message);
    });

  res.json(results);
});

//Assign Admin to user
router.post("/api/assignAdmin/", function (req, res) {
  let userId = req.body.userId;
  let adminRolesId = req.body.adminRolesId;

  const url = process.env.ISSUER_BASE_URL + "api/v2/users/" + userId + "/roles";

  let r_body = {
    roles: [adminRolesId],
  };

  (async () => {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(r_body),
      headers: new Headers({
        "content-type": "application/json; charset=UTF-8",
        authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          res.status(500).json({ message: "failed" });
          return;
        }
        res.status(204).json("Success");
      })
      .catch((err) => {
        console.log("err message", err.message);
        res.status(500).json({ message: err.message });
      });
  })();
});

//Remove Admin from user
router.delete("/api/removeAdmin/", function (req, res) {
  let userId = req.body.userId;
  let adminRolesId = req.body.adminRolesId;

  const url = process.env.ISSUER_BASE_URL + "api/v2/users/" + userId + "/roles";

  let r_body = {
    roles: [adminRolesId],
  };

  (async () => {
    await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(r_body),
      headers: new Headers({
        "content-type": "application/json; charset=UTF-8",
        authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          res.status(500).json({ message: "failed" });
          return;
        }
        res.status(204).json("Success");
      })
      .catch((err) => {
        console.log("err message", err.message);
        res.status(500).json({ message: err.message });
      });
  })();
});
/*******************************************
 **************** Track APIs ***************
 *******************************************/
// test routes
router.get(OPEN_APIS + "/testInput/:input", (req, res) => {
  try {
    let input_check = checkString(req.params.input);
    if (input_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: input_check,
      });
      return;
    }
    res.json("Pass");
  } catch {
    res.status(500).json({ message: error.message });
  }
});

// get track by track name, artist name, or album name
router.get(OPEN_APIS + "/getTracksBySearchName/:name", async (req, res) => {
  try {
    let input_check = checkString(req.params.name);
    if (input_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: input_check,
      });
      return;
    }

    // search the name with space removed
    let str_with_no_space = req.params.name.replace(/\s+/g, "");
    let pattern = `.*${str_with_no_space}.*`;
    const data = await Track.find()
      .or([
        { track_title: { $regex: pattern, $options: "i" } },
        { artist_name: { $regex: pattern, $options: "i" } },
        { album_title: { $regex: pattern, $options: "i" } },
      ])
      .limit(10)
      .sort({ track_title: 1 })
      .select(
        "track_id album_id album_title artist_id artist_name tags track_date_created track_date_recorded track_duration track_genres track_number track_title"
      );

    if (!data || data.length == 0) {
      res.status(404).json({
        message: "The track with the given name was not found",
      });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the following details for a given track ID
router.get(OPEN_APIS + "/getTrackById/:id", async (req, res) => {
  try {
    let input_check = checkValidNumer(req.params.id);
    if (input_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: input_check,
      });
      return;
    }

    const data = await Track.find({ track_id: req.params.id }).select(
      "track_id album_id album_title artist_id artist_name tags track_date_created track_date_recorded track_duration track_genres track_number track_title"
    );

    if (!data || data.length == 0) {
      res.status(404).json({
        message: "The track with the given ID was not found",
      });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the following details for a given track ID
router.get(OPEN_APIS + "/getTracksByIds/:ids", async (req, res) => {
  try {
    // check params
    let id_check = checkValidNumers(req.params.ids);
    if (id_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: id_check,
      });
      return;
    }

    // get list
    let ids = req.params.ids.split(",");

    // check duplicates
    if (new Set(ids).size !== ids.length) {
      // 400: bad request
      let msg = `contains duplicated track ids`;
      res.status(400).json({
        message: msg,
      });
      return;
    }

    // get tracks from db
    results = [];
    for (id of ids) {
      const data = await Track.find({ track_id: id }).select(
        "track_id album_id album_title artist_id artist_name tags track_date_created track_date_recorded track_duration track_genres track_number track_title"
      );
      if (!data || data.length == 0) {
        res.status(404).json({
          message: "The track with the given ID was not found",
        });
        return;
      }
      results.push(data);
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**********************************************
 **************** Playlist APIs ***************
 **********************************************/

/**************** OPEN APIs ****************/
router.get(OPEN_APIS + "/getAllPlayList", async (req, res) => {
  try {
    const data = await PlayList.find({ public: true }).limit(10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(OPEN_APIS + "/getPlayListByName/:name", async (req, res) => {
  try {
    let input_check = checkString(req.params.name);
    if (input_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: input_check,
      });
      return;
    }

    const data = await PlayList.find().and([
      { public: true },
      { list_name: req.params.name },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(OPEN_APIS + "/getSummaryOfLists", async (req, res) => {
  try {
    // get all lists
    const data = await PlayList.find({ public: true }).select(
      "list_name list_creator last_modified_date track_ids reviews"
    );

    let results = [];
    for (let e of data) {
      let rating = 0;
      if (e.reviews.length) {
        e.reviews.forEach((r) => {
          rating += r.rating;
        });
        rating = (rating / e.reviews.length).toFixed(1);
      }

      let result = {};
      result["list_name"] = e.list_name;
      result["list_creator"] = e.list_creator;
      result["last_modified_date"] = e.last_modified_date;
      result["number_tracks"] = e.track_ids.length;
      result["list_rating"] = rating;
      result["total_play_time"] = await getTotalPlayTime(e.track_ids);
      results.push(result);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**************** SECURE APIs ****************/
router.get(SECURE_APIS + "/getAllPlayList", jwtCheck, async (req, res) => {
  try {
    const data = await PlayList.find({ public: false });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(SECURE_APIS + "/getPlayListByName/:name", jwtCheck, async (req, res) => {
  try {
    let input_check = checkString(req.params.name);
    if (input_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: input_check,
      });
      return;
    }

    const data = await PlayList.find({ list_name: req.params.name });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(SECURE_APIS + "/getSummaryOfLists/:user", jwtCheck, async (req, res) => {
  try {
    let username = req.params.user;

    let input_check = checkString(username);
    if (input_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: input_check,
      });
      return;
    }

    // get all lists
    const data = await PlayList.find({ list_creator: username }).select(
      "list_name list_creator last_modified_date track_ids reviews"
    );

    let results = [];
    for (let e of data) {
      let rating = 0;
      if (e.reviews.length) {
        e.reviews.forEach((r) => {
          rating += r.rating;
        });
        rating = (rating / e.reviews.length).toFixed(1);
      }

      let result = {};
      result["list_name"] = e.list_name;
      result["list_creator"] = e.list_creator;
      result["last_modified_date"] = e.last_modified_date;
      result["number_tracks"] = e.track_ids.length;
      result["list_rating"] = rating;
      result["total_play_time"] = await getTotalPlayTime(e.track_ids);
      results.push(result);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(SECURE_APIS + "/createList/", jwtCheck, async (req, res) => {
  try {
    let input_check = checkString(req.body.name);
    if (input_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: input_check,
      });
      return;
    }

    const name = req.body.name;
    const data_cnt = await PlayList.find({
      list_name: name,
    }).count();

    if (data_cnt > 0) {
      // indicates that the request could not be completed due to a conflict
      // with the current state of the target resource.
      res.status(409).json({
        message: "This name has already been used",
      });
      return;
    }

    let l_creator = req.body.creator;
    let l_description = req.body.description;
    let timestamp = Date.now();

    let data = new PlayList({
      list_name: name,
      list_creator: l_creator,
      description: l_description,
      last_modified_date: timestamp,
      public: req.body.public,
    });

    const result = await data.save();
    // 201: This status code should be returned whenever the new instance is created
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(SECURE_APIS + "/saveList/", jwtCheck, async (req, res) => {
  try {
    // check name
    let name_check = checkString(req.body.name);
    let id_check = checkValidNumers(req.body.ids);
    if (name_check.length > 0 || id_check.length > 0) {
      // 400: bad request
      let msg = name_check.length > 0 ? name_check : id_check;
      res.status(400).json({
        message: msg,
      });
      return;
    }

    // save list
    let l_name = req.body.name;
    let ids = req.body.ids.split(",");

    // check duplicates
    if (new Set(ids).size !== ids.length) {
      // 400: bad request
      let msg = `contains duplicated track ids`;
      res.status(400).json({
        message: msg,
      });
      return;
    }

    // check if track id exists in db
    for (id of ids) {
      const cnt = await Track.find({ track_id: id }).count();
      if (cnt == 0) {
        // 400: bad request
        let msg = `track id ${id} does not exist in database`;
        res.status(400).json({
          message: msg,
        });
        return;
      }
    }

    const data = await PlayList.findOne({
      list_name: l_name,
    });
    if (!data) {
      res.status(404).json({ message: "This list does not exist" });
      return;
    }

    let timestamp = Date.now();
    data.set({
      last_modified_date: timestamp,
      track_ids: ids,
    });
    const result = await data.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(SECURE_APIS + "/editListName/", jwtCheck, async (req, res) => {
  try {
    // check name
    let name_check = checkString(req.body.name);
    let new_name_check = checkString(req.body.newName);

    if (name_check.length > 0 || new_name_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: name_check.length > 0 ? name_check : new_name_check,
      });
      return;
    }

    let l_name = req.body.name;
    let l_newName = req.body.newName;

    const data = await PlayList.findOne({
      list_name: l_name,
    });
    if (!data) {
      res.status(404).json({ message: "This list does not exist" });
      return;
    }

    let timestamp = Date.now();
    data.set({
      last_modified_date: timestamp,
      list_name: l_newName,
    });
    const result = await data.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(SECURE_APIS + "/editListDes/", jwtCheck, async (req, res) => {
  try {
    // check name
    let name_check = checkString(req.body.name);
    if (name_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: name_check,
      });
      return;
    }

    // max length 100
    if (req.body.description.length == 0 || req.body.description.length > 100) {
      // 400: bad request
      res.status(400).json({
        message: "invalid description length",
      });
      return;
    }

    let l_name = req.body.name;
    let l_description = req.body.description;

    const data = await PlayList.findOne({
      list_name: l_name,
    });
    if (!data) {
      res.status(404).json({ message: "This list does not exist" });
      return;
    }

    let timestamp = Date.now();

    data.set({
      last_modified_date: timestamp,
      description: l_description,
    });
    const result = await data.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(SECURE_APIS + "/editListVisibility/", jwtCheck, async (req, res) => {
  try {
    // check name
    let name_check = checkString(req.body.name);
    if (name_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: name_check,
      });
      return;
    }

    let l_name = req.body.name;

    const data = await PlayList.findOne({
      list_name: l_name,
    });
    if (!data) {
      res.status(404).json({ message: "This list does not exist" });
      return;
    }

    let isPublic = req.body.isPublic;
    let timestamp = Date.now();
    data.set({
      last_modified_date: timestamp,
      public: isPublic,
    });
    const result = await data.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(SECURE_APIS + "/addReview/", jwtCheck, async (req, res) => {
  try {
    let l_name = req.body.name;
    let l_commenter = req.body.commenter;
    let l_rating = req.body.rating;
    let l_comment = req.body.comment;

    // check name
    let name_check = checkString(l_name);
    let commenter_check = checkString(l_commenter);
    if (name_check.length > 0 || commenter_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: name_check.length > 0 ? name_check : commenter_check,
      });
      return;
    }

    // check rating
    if (l_rating < 0 || l_rating > 5) {
      // 400: bad request
      res.status(400).json({
        message: "invalid rating",
      });
      return;
    }

    // check comment, max length 100
    if (l_comment.length > 100) {
      // 400: bad request
      res.status(400).json({
        message: "invalid comment length",
      });
      return;
    }

    const data = await PlayList.findOne().and([
      { list_name: l_name },
      { public: true },
    ]);
    if (!data) {
      res.status(404).json({ message: "This list does not exist" });
      return;
    }

    let timestamp = Date.now();
    let review = new Reviews({
      commenter: l_commenter,
      rating: l_rating,
      comment: l_comment,
      comment_date: timestamp,
      hidden: false,
    });

    const data2 = await PlayList.findOneAndUpdate(
      { list_name: l_name },
      {
        $push: {
          reviews: review,
        },
        $set: {
          last_modified_date: timestamp,
        },
      },
      { new: true }
    );
    // const result = await data.save();
    res.status(200).json(data2);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete(SECURE_APIS + "/removeList/", jwtCheck, async (req, res) => {
  try {
    let input_check = checkString(req.body.name);
    if (input_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: input_check,
      });
      return;
    }

    let name = req.body.name;

    const data = await PlayList.findOneAndDelete({
      list_name: name,
    });

    if (!data) {
      res.status(404).json({ message: "This list does not exist" });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(SECURE_APIS + "/removeReview/", jwtCheck, async (req, res) => {
  try {
    let l_name = req.body.name;
    let l_reviewId = req.body.reviewId;

    // check name
    let name_check = checkString(l_name);
    if (name_check.length > 0) {
      // 400: bad request
      res.status(400).json({
        message: name_check,
      });
      return;
    }

    let timestamp = Date.now();
    const data = await PlayList.updateOne(
      { list_name: l_name },
      {
        $pull: {
          reviews: { _id: l_reviewId },
        },
        $set: {
          last_modified_date: timestamp,
        },
      }
    );

    if (!data) {
      res.status(404).json({ message: "Remove failed" });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**************** ADMIN APIs ****************/
router.put(ADMIN_APIS + "/updateReviewVisibility/", async (req, res) => {
  try {
    let l_reviewId = req.body.reviewId;
    let newStatus = req.body.newStatus;

    const data = await PlayList.findOneAndUpdate(
      {
        "reviews._id": ObjectId(l_reviewId),
      },
      {
        $set: {
          "reviews.$.hidden": newStatus,
        },
      },
      { new: true }
    );

    if (!data) {
      res.status(404).json({ message: "This list does not exist" });
      return;
    }

    // const result = await data.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/************************************
 *********** FUNCTIONS **************
 ************************************/
async function getTotalPlayTime(t_ids) {
  let totalSec = 0;

  const data = await getPlayTime(t_ids);
  data.forEach((e) => {
    let t_duration = e.track_duration.split(":");
    totalSec += parseInt(t_duration[0]) * 60; // minutes
    totalSec += parseInt(t_duration[1]); //  seconds
  });

  let hours = Math.floor(totalSec / 3600);
  let minutes = Math.floor((totalSec % 3600) / 60);
  let seconds = totalSec % 60;

  let minsSecs = `${minutes}:${seconds}`;

  return hours > 0 ? `${hours}:${minsSecs}` : minsSecs;
}

async function getPlayTime(t_ids) {
  const data = await Track.find({
    track_id: { $in: t_ids },
  }).select("track_id track_duration");
  return data;
}

function checkValidNumer(input) {
  let e_msg = "";
  let regex = /^[0-9]+$/;
  if (!regex.test(input)) {
    e_msg = "id should be number only";
  } else if (parseInt(input) > Number.MAX_SAFE_INTEGER) {
    e_msg = "id should be smaller than Number.MAX_SAFE_INTEGER";
  }
  return e_msg;
}

function checkValidNumers(input) {
  let e_msg = "";
  let regex = /^[0-9]+$/;

  let nums = input.split(",");

  for (n of nums) {
    if (!regex.test(n)) {
      e_msg = "id should be number only";
      break;
    } else if (parseInt(input) > Number.MAX_SAFE_INTEGER) {
      e_msg = "id should be smaller than Number.MAX_SAFE_INTEGER";
      break;
    }
  }

  return e_msg;
}

function checkString(input) {
  let e_msg = "";
  if (input.length > 30) {
    e_msg = "name should be no more than 30 characters";
    return e_msg;
  }

  // special characters not allowed
  let regex = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (regex.test(input)) {
    e_msg = "special characters not allowed";
  }

  return e_msg;
}

router.post(ADMIN_APIS + "/securityPolicy", async (req,res)=>{
  try{
    let s_policy =req.body.s_policy;

    const data = await ModifyPolicy.findOneAndUpdate(
        {
            policy_name:"securityPolicy"
        },
        {
            $set: {policy_content: s_policy}
        }
    )
    res.json(data);
    // res.json(s_policy);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  })

  router.post(ADMIN_APIS + "/AUPPolicy", async (req,res)=>{
    try{
      let a_policy =req.body.a_policy;
  
      const data = await ModifyPolicy.findOneAndUpdate(
          {
              policy_name:"AUPPolicy"
          },
          {
              $set: {policy_content: a_policy}
          }
      )
      res.json(data);
      // res.json(s_policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    })
  
    router.post(ADMIN_APIS + "/DMCAPolicy", async (req,res)=>{
        try{
          let d_policy =req.body.d_policy;
      
          const data = await ModifyPolicy.findOneAndUpdate(
              {
                  policy_name:"DMCAPolicy"
              },
              {
                  $set: {policy_content: d_policy}
              }
          )
          res.json(data);
          // res.json(s_policy);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        })
