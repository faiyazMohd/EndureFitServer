const express = require("express");
const router = express.Router();
const Threads = require("../../models/forum/Threads");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../../middleware/fetchuser");
// Route 1 : Add a new Note  using : POST "/api/forum/addthread" . login required
router.post(
  "/addthreads",
  fetchuser,
  [
    body("threadTitle", "title must be atleast 8 character").isLength({
      min: 8,
    }),
    body("threadDesc", "description must be atleast 15 character").isLength({
      min: 15,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { categoryId, threadTitle, threadDesc } = req.body;
      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({
          success,
          msg: "title must be atleast 3 character and description must be atleast 5 character",
        });
      }
      let userId = req.user.id;
      //   console.log(userId);
      console.log(categoryId);
      const thread = new Threads({
        userId: userId,
        categoryId: categoryId,
        threadTitle: threadTitle,
        threadDesc: threadDesc,
      });
      success = true;
      const savedthread = await thread.save();
      res.json({ success, msg: "Thread Added Successfully", savedthread });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
      console.log(error);
    }
  }
);

// Route 2 : get all thread with respective category id  using : GET "/api/forum/getthreads/:id" . No login required
router.get("/getthreads/:id", async (req, res) => {
  let success = false;
  try {
    let categoryId = req.params.id;
    console.log(categoryId);
    const threads = await Threads.find({ categoryId: categoryId });
    success = true;
    res.json({
      success,
      msg: "Fetched threads with corresponding category",
      threads,
    });
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error" });
    console.log(error);
  }
});

// Route 3 : update a thread using : PUT "/api/forum/editthread/:id" . login required
router.put(
  "/editthread/:id",
  fetchuser,
  [
    body("threadTitle", "title must be atleast 8 character").isLength({
      min: 8,
    }),
    body("threadDesc", "description must be atleast 15 character").isLength({
      min: 15,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { categoryId, threadTitle, threadDesc } = req.body;
      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({
          success,
          msg: "title must be atleast 8 character and description must be atleast 15 character",
        });
      }
      let userId = req.user.id;
      let threadId = req.params.id;
      const newThread = {};
      if (threadTitle) {
        newThread.threadTitle = threadTitle;
      }
      if (threadDesc) {
        newThread.threadDesc = threadDesc;
      }
      newThread.userId = userId;
      newThread.categoryId = categoryId;

      //   console.log(userId);
      //   console.log(categoryId);
      //   console.log(threadId);

      //Find the note to be updated and update it
      const thread = await Threads.findById(req.params.id);
      if (!thread) {
        success = false;
        return res.status(404).send({ success, msg: "No thread Found" });
      }

      //Allow updation only if user owns this note
      if (thread.userId.toString() !== userId) {
        success = false;
        return res.status(401).send({ success, msg: "Not Allowed" });
      }
      
      const updatedThread = await Threads.findByIdAndUpdate(
        threadId,
        { $set: newThread },
        { new: true }
      );
      success = true;
      res.json({ success, msg: "Thread Updated Successfully", updatedThread });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
      console.log(error);
    }
  }
);

// Route 4 : delete a thread using :DEL "/api/forum/deletethread/:id" . login required
router.delete(
  "/deletethread/:id",
  fetchuser,
  async (req, res) => {
    let success = false;
    try {
      let userId = req.user.id;
      let threadId = req.params.id;
      //Find the note to be updated and update it
      const thread = await Threads.findById(req.params.id);
      if (!thread) {
        success = false;
        return res.status(404).send({ success, msg: "No thread Found" });
      }

      //Allow deletion only if user owns this thread
      if (thread.userId.toString() !== userId) {
        success = false;
        return res.status(401).send({ success, msg: "Not Allowed" });
      }
      
      const deletedThread = await Threads.findByIdAndDelete(threadId);

      success = true;
      res.json({ success, msg: "Thread Deleted Successfully"});
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
      console.log(error);
    }
  }
);

module.exports = router;
