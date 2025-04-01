// models/story.js

const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaUrl: [
      {
        type: String,
        required: true,
      },
    ],
    type: {
      type: String,
      enum: ["image", "video", "both"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "24h", 
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
