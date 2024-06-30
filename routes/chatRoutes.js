import express from "express";

import { getChatList, getMessage, createChat, sendMessage } from "../controllers/chatController.js";
const router = express.Router();


router.post('/chats', getChatList)
router.post('/', createChat);
router.post('/:chatId', sendMessage)
router.get('/get-messages/:chatId', getMessage)

export default router