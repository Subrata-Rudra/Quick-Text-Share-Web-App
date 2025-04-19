const express = require("express");

const { saveText, getText } = require("../controllers/textController");

const router = express.Router();

router.route("/").post(saveText);
router.route("/:token").get(getText);

module.exports = router;
