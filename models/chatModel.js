import mongoose from "mongoose";
import { Schema } from "mongoose"

const chatSchema = new mongoose.Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: "Users"}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message" }],

}, {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema)

export default Chat