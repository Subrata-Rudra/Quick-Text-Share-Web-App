const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const redis = require("./config/Redis");
const textRoutes = require("./routes/textRoutes");

dotenv.config();

connectDb();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  res
    .status(200)
    .json({ message: "Quick Text Sharing web app's server is running okay✅" });
});

app.use("/", textRoutes);

app.listen(port, () => {
  console.log(
    `Quick Text Sharing web app's server is running on: http://localhost:${port}`
  );
});
