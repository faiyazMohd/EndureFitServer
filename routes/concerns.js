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
  ],
  async (req, res) => {
    let success = false;
    try {
      const { userQuery, userFeedbacks, userConcern } = req.body;
      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({
          success,
          msg: "userQuery , userInfo and userConcern cannot be blank",
        });
      }

      let userId = req.user.id;
      const concern = new Concerns({
        userId: userId,
        userQuery: userQuery,
        userFeedbacks: userFeedbacks,
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
