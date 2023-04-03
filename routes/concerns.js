const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Concerns = require("../models/Concerns");

// Route 1 : Create a User Concern using: POST "/api/concerns" . login required
router.post(
  "/concerns",
  fetchuser,
  [
    body("userQuery", "userQuery must be atleast 10 character").isLength({
      min: 10,
    }),
    body("userInfo", "userInfo must be atleast 15 character").isLength({
      min: 15,
    }),
    body("userConcern", "userConcern must be atleast 12 character").isLength({
      min: 12,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { userQuery, userInfo, userConcern } = req.body;
      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({
          success,
          msg: "userQuery must be atleast 10 character, userInfo must be atleast 15 character, userConcern must be atleast 12 character",
        });
      }

      let userId = req.user.id;
      //   console.log(userId);
      const concern = new Concerns({
        userId: userId,
        userQuery: userQuery,
        userInfo: userInfo,
        userConcern: userConcern,
      });
      success = true;
      const savedConcern = await concern.save();
      res.json({ success, msg: "Concern Added Successfully", savedConcern });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
      console.log(error);
    }
  }
);
module.exports = router;
