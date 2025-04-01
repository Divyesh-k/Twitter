const express = require("express");
const { addMessage ,getMessages} = require("../controllers/message.controller.js");

const router = express.Router();


router.post('/am',addMessage)
router.get('/getmessage/:chatId',getMessages)

module.exports = router;