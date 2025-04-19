const mongoose = require("mongoose");

const textSchema = mongoose.Schema({
  textBodyUrl: { type: String, required: true, unique: true },
  textPublicId: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  tokenExpiresAt: { type: Date },
});

const Text = mongoose.model("Text", textSchema);

module.exports = Text;
