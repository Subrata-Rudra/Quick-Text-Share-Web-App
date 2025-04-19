const expressAsyncHandler = require("express-async-handler");
const redis = require("../config/Redis");
const cloudinary = require("../config/cloudinary");
const { promisify } = require("util");
const Text = require("../models/textSchema");

const getFromRedisAsync = promisify(redis.get).bind(redis);

const generateToken = async () => {
  let token = Math.floor(1000 + Math.random() * 9000).toString();
  let tokenExist = await Text.findOne({ token });
  while (tokenExist) {
    token = Math.floor(1000 + Math.random() * 9000).toString();
    tokenExist = await Text.findOne({ token });
  }
  return token;
};

const deleteData = async (token) => {
  try {
    const record = await Text.findOne({ token }).select("textPublicId");

    await cloudinary.uploader.destroy(record.textPublicId, {
      resource_type: "raw",
    });
  } catch (error) {
    console.error(
      "Error occurred in deleting text file from cloudinary. ERROR_DETAILS: " +
        error
    );
  }
  try {
    await Text.findOneAndDelete({ token });
  } catch (error) {
    console.error(
      "Error occurred in deleting data from database. ERROR_DETAILS: " + error
    );
  }
};

const saveText = expressAsyncHandler(async (req, res) => {
  const { url, publicId, expiresInMinutes } = req.body;
  if (!url) {
    res
      .status(400)
      .json({ token: "", message: "Please send the url of the text file" });
  } else if (!publicId) {
    res.status(400).json({
      token: "",
      message: "Please send the publicId of the text file",
    });
  } else if (!expiresInMinutes) {
    res
      .status(400)
      .json({ token: "", message: "Please send the expiry time (in minutes)" });
  } else {
    try {
      let text = await Text.create({
        textBodyUrl: url,
        textPublicId: publicId,
        token: await generateToken(),
        tokenExpiresAt: Date.now() + expiresInMinutes * 60 * 1000,
      });

      res.status(200).json({
        url: text.textBodyUrl,
        token: text.token,
        message: "Text link added to database",
      });
    } catch (error) {
      if (error.code === 11000) {
        const existingText = await Text.findOne({ textBodyUrl: url });
        res.status(200).json({
          token: existingText.token,
          message: "This url is already stored in the database",
        });
      } else {
        console.error(
          "Error occurred in adding data to database. ERROR_DETAILS: " + error
        );
        res.status(500).json({
          token: "",
          message: "Something error occurred while adding data to database",
        });
      }
    }
  }
});

const getText = expressAsyncHandler(async (req, res) => {
  const token = req.params.token;

  if (!token) {
    res.status(400).json({ url: "", message: "Please send the token" });
  } else {
    let dataFoundInCache = false;
    try {
      let data = await getFromRedisAsync(token);
      if (data != null) {
        dataFoundInCache = true;
        let currentTime = Date.now();
        data = await JSON.parse(data);
        let expiryTime = new Date(data.tokenExpiresAt).getTime();
        if (expiryTime > currentTime) {
          return res
            .status(200)
            .json({ url: data.textBodyUrl, message: "Everything is okay" });
        } else {
          res.status(404).json({
            url: "",
            message: "Text is deleted, as 1 hour is passed",
          });
          await deleteData(token);
          return;
        }
      }
    } catch (error) {
      console.error(
        "Error occurred in getting data from Redis. ERROR_DETAILS: " + error
      );
    }

    if (dataFoundInCache === false) {
      let data = await Text.findOne({ token: token }).select(
        "textBodyUrl token tokenExpiresAt"
      );
      if (data != null) {
        let currentTime = Date.now();
        let expiryTime = new Date(data.tokenExpiresAt).getTime();
        if (expiryTime > currentTime) {
          res
            .status(200)
            .json({ url: data.textBodyUrl, message: "Everything is okay" });
          await redis.set(token, JSON.stringify(data));
          let secondsLeft = Math.floor((expiryTime - currentTime) / 1000);
          await redis.expire(token, secondsLeft);
        } else {
          res.status(404).json({
            url: "",
            message: "Text is deleted, as expiry time is passed",
          });
          await deleteData(token);
        }
      } else {
        res.status(401).json({
          url: "",
          message: "Invalid token sent",
        });
      }
    }
  }
});

module.exports = { saveText, getText };
