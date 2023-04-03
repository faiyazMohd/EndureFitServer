const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const UserDetails = require("../models/UserDetails");
const ExerciseBookMarks = require("../models/ExerciseBookMarks");
const RecipeBookMarks = require("../models/RecipeBookmarks");
// Route 1 : Storing user details : POST  "/api/userDetails/storedetails" . login required
router.post(
  "/storedetails",
  fetchuser,
  [
    body("userId", "userId must be atleast 20 character")
      .isLength({ min: 10 })
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("userName", "userName must be atleast 3 character")
      .isLength({
        min: 3,
      })
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("userDetails", "must be a object").isObject(),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { userId, userName, userDetails } = req.body;

      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      //   console.log(req.body.userName);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Invalid Inputs",
        });
      }
      let userDet = await UserDetails.findOneAndUpdate(
        userId,
        { $set: req.body },
        { new: true, upsert: true }
      );
      success = true;
      res.json({ success, msg: "UserDetails Inserted Successfully" });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
    }
  }
);

// Route 2 : retrieving user details : POST  "/api/userDetails/getdetails" . login required
router.get("/getdetails", fetchuser, [], async (req, res) => {
  let success = false;
  try {
    let userId = req.user.id;
    console.log(userId);
    // let userDet = await UserDetails.findOne({userId}).exec();
    let userDet = await UserDetails.findOneAndUpdate(userId, {});
    console.log("user Details is " + userDet);
    success = true;
    res.json({ success, msg: "UserDetails Retrieved Successfully", userDet });
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error" });
  }
});

// Route 3 : Storing ExerciseBookMarks : POST  "/api/userDetails/addexercisebookmark" . login required
router.post(
  "/addexercisebookmark",
  fetchuser,
  [body("bookmarkDetail", "must be a object").isObject()],
  async (req, res) => {
    let success = false;
    try {
      const { bookmarkDetail } = req.body;

      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      //   console.log(req.body.userName);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Invalid Inputs",
        });
      }

      let userId = req.user.id;

      let bookmarkCheck = await ExerciseBookMarks.findOne({
        bookmarkDetail: bookmarkDetail,
      });
      if (bookmarkCheck) {
        console.log("bookmarkCheck is " + bookmarkCheck);
        if (bookmarkCheck.userId.toString() !== userId) {
          const bookmark = new ExerciseBookMarks({
            userId: userId,
            bookmarkDetail: bookmarkDetail,
          });
          console.log("line 124");
          console.log("bookmark is " + bookmark);
          const savedBookmark = await bookmark.save();
          success = true;
          res.json({
            success,
            msg: "Bookmark Added Successfully",
            savedBookmark,
          });
        } else {
          console.log(
            "bookmarkCheck.userId is " + bookmarkCheck.userId.toString()
          );
          console.log("userId is " + userId);
          success = false;
          return res.status(400).json({
            success,
            msg: "Bookmark already exists for this user",
          });
        }
      } else {
        const bookmark = new ExerciseBookMarks({
          userId: userId,
          bookmarkDetail: bookmarkDetail,
        });
        console.log("bookmark is " + bookmark);
        const savedBookmark = await bookmark.save();
        success = true;
        res.json({
          success,
          msg: "Bookmark Added Successfully for this user",
          savedBookmark,
        });
      }
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error", error });
      console.log(error);
    }
  }
);

// Route 4 : Fetching all the B0okmark of a user using : GET  "/api/userDetails/getexercisebookmark" . login required
router.get("/getexercisebookmark", fetchuser, async (req, res) => {
  let success = false;
  try {
    const bookmarks = await ExerciseBookMarks.find({ userId: req.user.id });
    console.log(bookmarks);
    success = true;
    res.json({ success, msg: "Fetched all bookmarks", bookmarks });
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error" });
  }
});

// Route 5 : Storing RecipeBookMarks : POST  "/api/userDetails/addrecipebookmark" . login required
router.post(
  "/addrecipebookmark",
  fetchuser,
  [body("bookmarkDetail", "must be a object").isObject()],
  async (req, res) => {
    let success = false;
    try {
      const { bookmarkDetail } = req.body;

      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      //   console.log(req.body.userName);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Invalid Inputs",
        });
        8;
      }

      let userId = req.user.id;

      let bookmarkCheck = await RecipeBookMarks.findOne({
        bookmarkDetail: bookmarkDetail,
      });

      // let userCheck = await RecipeBookMarks.findOne({ userId: userId });

      if (bookmarkCheck) {
        console.log("bookmarkCheck is " + bookmarkCheck);
        if (bookmarkCheck.userId.toString() !== userId) {
          const bookmark = new RecipeBookMarks({
            userId: userId,
            bookmarkDetail: bookmarkDetail,
          });
          console.log("line 124");
          console.log("bookmark is " + bookmark);
          const savedBookmark = await bookmark.save();
          success = true;
          res.json({
            success,
            msg: "Bookmark Added Successfully",
            savedBookmark,
          });
        } else {
          console.log(
            "bookmarkCheck.userId is " + bookmarkCheck.userId.toString()
          );
          console.log("userId is " + userId);
          success = false;
          return res.status(400).json({
            success,
            msg: "Bookmark already exists for this user",
          });
        }
      } else {
        const bookmark = new RecipeBookMarks({
          userId: userId,
          bookmarkDetail: bookmarkDetail,
        });
        console.log("bookmark is " + bookmark);
        const savedBookmark = await bookmark.save();
        success = true;
        res.json({
          success,
          msg: "Bookmark Added Successfully for this user",
          savedBookmark,
        });
      }

    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
    }
  }
);

// Route 6 : Fetching all the Bookmark of a user using : GET  "/api/userDetails/getrecipebookmark" . login required
router.get("/getrecipebookmark", fetchuser, async (req, res) => {
  let success = false;
  try {
    const bookmarks = await RecipeBookMarks.find({ userId: req.user.id });
    console.log(bookmarks);
    success = true;
    res.json({ success, msg: "Fetched all bookmarks", bookmarks });
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error" });
  }
});
module.exports = router;
