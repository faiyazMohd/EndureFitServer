const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_KEY;

const fetchuser = (req, res, next) => {
  //Get the user from the jwt token and add id to req object
  let success = false;
  const token = req.header("auth-token");
  if (!token) {
    success = false;
    res
      .status(401)
      .send({ success, msg: "Please authenticate using a valid token" });
  }

  try {
    console.log("inside fetchuser line 16");
    const data = jwt.verify(token,JWT_SECRET)
    // console.log("data is"+data.user);
    req.user = data.user;
    // console.log(req.user);
    next();
  } catch (error) {
    success = false;
    res
      .status(401)
      .send({ success, msg: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
