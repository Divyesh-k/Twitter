const { Chat }   = require("../models/chat.model.js");

const createChat = async (req, res) => {
  const newchat = new Chat({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const result = await newchat.save();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const userChats = async (req, res) => {
  try {
    const chat = await Chat.find({
      members: { $in: [req.params.userId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error in getChats controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const findChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });

    res.status(200).json(chat); 
  } catch (error) {
    console.error("Error in getChats controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createChat, userChats, findChat };

//-----------------------------------------------------------------------

// const Chat = require("../models/chat.model.js");
// const { Server } = require('socket.io');

// // Initialize Socket.IO
// let io;

//  const setIoInstance = (ioInstance) => {
//   io = ioInstance;
// };

// // Create a new chat or get an existing one between two users
//  const createChat = async (req, res) => {
//   const { participantId } = req.body;
//   const userId = req.user.id;

//   try {
//     // Check if a chat already exists between these users
//     let chat = await Chat.findOne({
//       participants: { $all: [userId, participantId] },
//     });

//     if (!chat) {
//       // Create a new chat if one doesn't exist
//       chat = new Chat({
//         participants: [userId, participantId],
//       });
//       await chat.save();
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Send a message in an existing chat
//  const sendMessage = async (req, res) => {
//   const { chatId } = req.params;
//   const { content } = req.body;
//   const userId = req.user.id;

//   try {
//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ error: "Chat not found" });
//     }

//     const newMessage = { sender: userId, content };
//     chat.messages.push(newMessage);
//     await chat.save();

//     // Emit the message to the chat room
//     io.to(chatId).emit('receiveMessage', newMessage);

//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all chats for the logged-in user
//  const getChats = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const chats = await Chat.find({ participants: userId }).populate(
//       "participants",
//       "username profileImg"
//     );

//     res.status(200).json(chats);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get a specific chat by ID
//  const getChatById = async (req, res) => {
//   const { chatId } = req.params;

//   try {
//     const chat = await Chat.findById(chatId).populate(
//       "participants",
//       "username profileImg"
//     );
//     if (!chat) {
//       return res.status(404).json({ error: "Chat not found" });
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { createChat, sendMessage, getChats, getChatById ,setIoInstance};
