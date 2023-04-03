const express = require("express");
const router = express.Router();
const Comments = require("../../models/forum/Comments");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../../middleware/fetchuser");

// Route 1 : Add a new Note  using : POST "/api/forum/addcomment" . login required
router.post(
  "/addcomment",
  fetchuser,
  [
    body("commentContent", "Content must be atleast 10 character").isLength({
      min: 10,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { threadId, commentContent } = req.body;

      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ 
          success,
          msg: "Content must be atleast 10 character",
        });
      }

      let userId = req.user.id;
      console.log("threadId is "+threadId);
      const thread = new Comments({
        userId: userId,
        threadId: threadId,
        commentContent: commentContent,
      });
      success = true;
      const savedComment = await thread.save();
      res.json({ success, msg: "Comment Added Successfully", savedComment });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
      console.log(error);
    }
  }
);


// Route 2 : get all thread with respective thread id  using : GET "/api/forum/getcomments/:id" . No login required
router.get("/getcomments/:id", async (req, res) => {
  let success = false;
  try {
    let threadId = req.params.id;
    console.log(threadId);
    const comments = await Comments.find({ threadId: threadId });
    success = true;
    res.json({
      success,
      msg: "Fetched all comments with corresponding thread",
      comments,
    });
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error" });
    console.log(error);
  }
});



// Route 3 : update a comment using : PUT "/api/forum/editthread/:id" . login required
router.put(
  "/editcomment/:id",
  fetchuser,
  [
    body("commentContent", "Content must be atleast 10 character").isLength({
      min: 15,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { threadId, commentContent } = req.body;

      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Content must be atleast 10 character",
        });
      }
      let userId = req.user.id;
      let commentId = req.params.id;

      const newComment = {};
      if (commentContent) {
        newComment.commentContent = commentContent;
      }
      newComment.userId = userId;
      newComment.threadId = threadId;

      //   console.log(userId);
      //   console.log(categoryId);
      //   console.log(threadId);

      //Find the note to be updated and update it
      const comment = await Comments.findById(req.params.id);
      if (!comment) {
        success = false;
        return res.status(404).send({ success, msg: "No comment Found" });
      }

      //Allow updation only if user owns this note
      if (comment.userId.toString() !== userId) {
        success = false;
        return res.status(401).send({ success, msg: "Not Allowed" });
      }
      
      const updatedComment = await Comments.findByIdAndUpdate(
        commentId,
        { $set: newComment },
        { new: true }
      );
      success = true;
      res.json({ success, msg: "Comment Updated Successfully", updatedComment });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
      console.log(error);
    }
  }
);


// Route 4 : delete a comment using :DEL "/api/forum/deletecomment/:id" . login required
router.delete(
  "/deletecomment/:id",
  fetchuser,
  async (req, res) => {
    let success = false;
    try {

      let userId = req.user.id;
      let commentId = req.params.id;

      const comment = await Comments.findById(commentId);
      if (!comment) {
        success = false;
        return res.status(404).send({ success, msg: "No comment Found" });
      }

      //Allow deletion only if user owns this comment
      if (comment.userId.toString() !== userId) {
        success = false;
        return res.status(401).send({ success, msg: "Not Allowed" });
      }
      
      const deletedComment = await Comments.findByIdAndDelete(commentId);

      success = true;
      res.json({ success, msg: "Comment Deleted Successfully"});
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
      console.log(error);
    }
  }
);



// Route 5 : update  Likes using : PUT "/api/forum/editcommentlikes/:id" . No login required
router.put(
    "/editcommentlikes/:id",
    [
      body("commentLikes", "comment Likes must be a Number").isNumeric()
    ],
    async (req, res) => {
      let success = false;
      try {
        const { commentLikes } = req.body;
  
        // If there are errors , return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          success = false;
          return res.status(400).json({
            success,
            msg: "comment Likes must be a Number",
          });
        }

        let commentId = req.params.id;

        const updatedLikes = await Comments.findByIdAndUpdate(
          commentId,
          { $set: {commentLikes:commentLikes} },
          { new: true }
        );
        success = true;
        res.json({ success, msg: "Comment Updated Successfully", updatedLikes });
      } catch (error) {
        success = false;
        res.status(500).send({ success, msg: "Internal server error" });
        console.log(error);
      }
    }
  );
  


module.exports = router;
