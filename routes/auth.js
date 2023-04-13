const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const GoogleUsers = require("../models/GoogleUsers");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = process.env.JWT_KEY;

// Route For Google Sign in using : P0ST "/api/auth/googlesignin"
router.post("/googlesignin", async (req, res) => {
  let success = false;
  // If there are errors , return bad request and the errors
  try {
    //check whether the user with this email exists already exists in normal users collection
    let googleuser = await User.findOne({ email: req.body.email });
    if (googleuser) {
      success = false;
      return res
        .status(400)
        .json({ success, msg: "Sorry a user with this email already exists" });
    } else {
      let googleuser = await GoogleUsers.findOne({ email: req.body.email });
      if (googleuser) {
        // Login with google
        const data = {
          user: {
            id: googleuser.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, msg: "User Logged In Successfully", authToken });
      } else {
        //create a new user in GoogleUsers collection
        googleuser = await GoogleUsers.create({
          name: req.body.name,
          picture:req.body.picture,
          email: req.body.email
        });
        const data = {
          user: {
            id: googleuser.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, msg: "User Created Successfully", authToken });
      }
    }
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error" });
  }
});

// Forget Password :  using: PUT: "/api/auth/forgetpass" . No login required
router.put(
  "/forgetpass",
  [
    body("email", "Enter a valid email").isEmail().normalizeEmail(),
    body("ans", "Answer should have atleast 1 character")
      .isLength({
        min: 1,
      }),
    body("newPassword", "password must be atleast 4 character")
      .isLength({
        min: 4,
      })
  ],
  async (req, res) => {
    let success = false;
    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res
        .status(400)
        .json({ success, msg: "Invalid Inputs", errors: errors.array() });
    }
    const { email, ques, ans, newPassword } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          msg: `${email} is not registered with us `,
        });
      }

      const ansCompare = await bcrypt.compare(ans, user.ans);
      if (!ansCompare) {
        success = false;
        return res.status(400).json({
          success,
          msg: "The Given Answer does not Match",
        });
      }
      if (ques !== user.ques) {
        success = false;
        return res.status(400).json({
          success,
          msg: "The Given Question does not Match",
        });
      }
      const passSalt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(newPassword, passSalt);
      // const updatedPassword = await User.findOneAndUpdate
      const updatedPassword = await User.findOneAndUpdate(
        { email },
        { $set: { password: secPass } },
        { new: true }
      );
      success = true;
      res.json({ success, msg: "Password Updated Successfully" });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
    }
  }
);

// Route 1 : Create a User using: POST "/api/auth/createuser" . No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name")
      .isLength({ min: 3 })
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("email", "Enter a valid email").isEmail().normalizeEmail(),
    body("ans", "Answer should have atleast 1 character")
      .isLength({
        min: 1,
      })
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("password", "password must be atleast 4 character")
      .isLength({
        min: 4,
      })
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res
        .status(400)
        .json({ success, msg: "Invalid Inputs", errors: errors.array() });
    }
    try {
      //check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        console.log("Inside create user in line 88");
        return res.status(400).json({
          success,
          msg: "Sorry a user with this email already exists",
        });
      }
      console.log("Inside create user in line 94");

      const passSalt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, passSalt);

      const ansSalt = await bcrypt.genSalt(10);
      const secAns = await bcrypt.hash(req.body.ans, ansSalt);
      //  create a new user
      console.log("Inside create user in line 98");
      console.log(req.body);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        ques: req.body.ques,
        ans: secAns,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, msg: "User Created Successfully", authToken });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
    }
  }
);

// Route 2 :  Authenticate a User using: POST "/api/auth/login" . No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail().normalizeEmail(),
    body("password", "password cannot be blank")
      .exists()
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res
        .status(400)
        .json({ success, msg: "Invalid Inputs", errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Please try to login with correct credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, msg: "User LoggedIn Successfully", authToken });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
    }
  }
);

// Route 3 : Get loggedin User Details using: POST "/api/auth/getuser" . Login required
router.get("/getuser", [], fetchuser, async (req, res) => {
  let success = false;
  try {
    // console.log(req.user);
    let userId = req.user.id;
    let user = await User.findById(userId).select("-password -ans -ques");
    if (!user) {
      const user = await GoogleUsers.findById(userId);
      success = true;
      res.send({success,user});
    } else {
      // user = body(user.name.toString()).unescape();
      success = true;
      res.send({success,user});
    }
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error",error });
    console.log(error);
  }
});



// Update UserName : Update UserName using: PUT: "/api/auth/updatename" . login required
router.put(
  "/updatename",
  [
    body("name", "Enter a valid name")
      .isLength({ min: 3 })
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  fetchuser,
  async (req, res) => {
    let success = false;
    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res
        .status(400)
        .json({ success, msg: "Invalid Inputs", errors: errors.array() });
    }
    try {
      const userId = req.user.id;
      const updatedName = await User.findByIdAndUpdate(
        userId,
        { $set: { name: req.body.name } },
        { new: true }
      );
      if (!updatedName) {
        const updatedName = await GoogleUsers.findByIdAndUpdate(
          userId,
          { $set: { name: req.body.name } },
          { new: true }
        );
        console.log(updatedName);
        success = true;
        res.json({ success, msg: "User Name Updated Successfully" });
      } else {
        // console.log(updatedName);
        success = true;
        res.json({ success, msg: "User Name Updated Successfully" });
      }
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Internal server error" });
    }
  }
);

module.exports = router;