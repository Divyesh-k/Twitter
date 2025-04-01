const { Message } = require("../models/chat.model.js");
const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new Message({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = { addMessage, getMessages };
