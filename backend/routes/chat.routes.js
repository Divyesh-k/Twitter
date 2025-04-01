const express = require("express");
// const { protectedRoute } = require("../middleware/protectedRoute.js");
const { createChat, userChats, findChat } = require("../controllers/chat.controller.js");


const router = express.Router();
router.post("/cc",createChat);
router.get("/:userId",userChats);
router.get("/find/:firstId/:secondId",findChat);



module.exports  = router;





 // ----------------------------------------------------------------------


// const express = require("express");
// const { protectedRoute } = require("../middleware/protectedRoute.js");
// const {
//   createChat,
//   sendMessage,
//   getChats,
//   getChatById,
// } = require("../controllers/chat.controller.js");

// const router = express.Router();

// // Create a new chat or fetch an existing one between two users
// router.post("/", protectedRoute, createChat);

// // Send a message in an existing chat
// router.post("/:chatId/message", protectedRoute, sendMessage);

// // Get all chats for the logged-in user
// router.get("/", protectedRoute, getChats);

// // Get a specific chat by ID
// router.get("/:chatId", protectedRoute, getChatById);

// module.exports =router;
