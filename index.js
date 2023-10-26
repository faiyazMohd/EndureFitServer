require("dotenv").config();
const connectToMongo = require("./db");
connectToMongo();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 6010; 

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", require("./routes/auth"));
app.use('/api/userDetails',require('./routes/userDetails'))
app.use('/api/',require('./routes/concerns'))
app.use('/api/',require('./routes/chatBot'))
app.use('/api/forum/',require('./routes/forum/categores.js'))
app.use('/api/forum/',require('./routes/forum/threads'))
app.use('/api/forum/',require('./routes/forum/comments'))

app.listen(port, () => {
  console.log(`EndureFit Backend listening at http://localhost:${port}`);
});
