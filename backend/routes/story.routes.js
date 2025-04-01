// routes/story.js

const express = require("express");
const { protectedRoute } = require("../middleware/protectedRoute");
const {
  createStory,
  getAllOtherStories,
  getUserStories,
} = require("../controllers/story.controller");

const router = express.Router();
// Create a new story
router.post("/cs", protectedRoute, createStory);

// get user stories
router.get("/getuserstories", protectedRoute, getUserStories);

// Get stories for a specific user
router.get("/getallstories", protectedRoute,getAllOtherStories);

module.exports = router;
