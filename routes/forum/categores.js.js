const express = require("express");
const router = express.Router();
const Categories = require("../../models/forum/Categories");
const Threads = require("../../models/forum/Threads");

//post a categories
router.post("/postcategory", async (req, res) => {
  let success = false;
  try {
    category = await Categories.create({
      categoryName: "Fitness Challenges",
      categoryDesc:
        "This forum category is focused on discussions related to fitness challenges, such as 30-day fitness challenges, weight loss challenges, and fitness competitions. You can find information on how to create and participate in fitness challenges, tips for staying motivated throughout the challenge, and ideas for tracking progress and celebrating achievements. This category also covers topics related to creating and joining fitness communities that support and encourage each other during challenges.",
    });
    res.json({ success, msg: " Successfull", category });
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error" });
    console.log(error);
  }
});

// Route 1 : Get all categories using: GET "/api/forum/getallcategories" .No Login required
router.get(
  "/getallcategories",
  async (req, res) => {
    let success = false;
    try {
      let category = await Categories.find({});
      res.send(category);
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error", error });
      console.log(error);
    }
  }
);



module.exports = router;
