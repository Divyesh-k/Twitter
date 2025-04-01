const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId, ref: "Chat",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  { members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { Chat, Message };

//--------------------------------------------------

// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema(
//   {
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { _id: false } // Prevents creating a new ObjectId for each message
// );

// const chatSchema = new mongoose.Schema(
//   {
//     participants: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },
//     ],
//     messages: [messageSchema],
//   },
//   { timestamps: true }
// );

// const Chat = mongoose.model("Chat", chatSchema);
// const Message = mongoose.model("Message",messageSchema)

// module.exports = { Chat, Message };
