const Story = require("../models/story.model.js");
// const User = require("../models/user.model.js"); // Ensure this path is correct
const cloudinary = require("cloudinary").v2;
const createStory = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming userId is available in req.user from protectedRoute middleware
    const { media } = req.body;

    // Check if media file is provided
    if (!media) {
      return res.status(400).json({ message: "No media file provided" });
    }

    // Upload media to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(media, {
      resource_type: "auto", // Automatically detect media type (image or video)
    });

    // Find existing story for the user
    let story = await Story.findOne({ user: userId });

    if (story) {
      // If story exists, push the new media URL to the mediaUrl array
      story.mediaUrl.push(uploadResponse.secure_url);

      // Check if the story contains both images and videos
      // const mediaTypes = story.mediaUrl.map(url => url.split('.').pop());
      // story.type = mediaTypes.includes('mp4') && mediaTypes.includes('jpg') ? "both" : mediaTypes[0];
    } else {
      // If no story exists, create a new one
      story = new Story({
        user: userId,
        mediaUrl: [uploadResponse.secure_url],
        type: "both", // Default type
      });
    }

    // Save the story to the database
    await story.save();

    res.status(201).json(story);
  } catch (error) {
    console.error("Error in createStory controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserStories = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming userId is available in req.user from protectedRoute middleware

    // Find the story for the given user ID
    const story = await Story.findOne({ user: userId })
      .populate("user", "username profileImg") // Populate only the username and profileImg fields
      .exec();

    if (!story) {
      return res
        .status(404)
        .json({ message: "No stories found for this user" });
    }

    // Get the mediaUrl array from the story
    // const mediaUrls = story.mediaUrl;

    // Send the mediaUrls array in the response
    res.status(200).json(story);
  } catch (error) {
    console.error("Error in getUserStories controller:", error);
    res.status(500).json({ error: error.message });
  }
};
const getAllOtherStories = async (req, res) => {
  try {
    const userId = req.user._id; // Get the authenticated user's ID

    // Find all stories except the ones belonging to the authenticated user
    const otherStories = await Story.find({ user: { $ne: userId } })
      .populate("user", "username profileImg") // Populate only the username and profileImg fields
      .exec();

    // Filter out stories where mediaUrl array is empty
    const storiesWithMedia = otherStories.filter(
      (story) => story.mediaUrl.length > 0
    );

    // Send the array of full story objects in the response
    res.status(200).json(storiesWithMedia);
  } catch (error) {
    console.error("Error in getAllOtherStories controller:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createStory,
  getAllOtherStories,
  getUserStories,
};
