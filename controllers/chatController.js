import { Server } from "socket.io";
import JWT, { decode } from "jsonwebtoken";
import Users from "../models/userModel.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://social-scape.netlify.app", // Replace with your frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });
  io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log("Not Authenticated");
    }
    try {
      const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

      console.log("decoded", decoded);

      const user = await Users.findById(decoded.userId);

      if (!user) {
        return next(new Error("User not found"));
      }
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.user.lastName);

    socket.on("private message", async ({ chatId, recipient, content }) => {
      console.log("messagefromserver", content);
      console.log("tofromserver", recipient);
      const newMessage = await Message.create({
        chat: chatId,
        sender: socket.user._id,
        recipient,
        content,
      });
      await newMessage.save();

      const chat = await Chat.findById(chatId);
      chat.messages.push(newMessage._id);
      await chat.save();
      console.log("newMessageCreated", newMessage);
      io.to(chatId).emit("newMessage", newMessage);
    });
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.user.lastName);
    });
  });

  return io;
};

// export const sendChats = async(req, res, next) => {
// io.use(async (socket) => {
//     try {
//         const {userId} = req.body.user;
//         const user = await Users.findById(userId);
//         if(user){
//                 socket.user = user;
//                 return next()
//             }

//     } catch (error) {
//         console.log(error)
//         next()
//     }

//     io.on('connection', (socket) => {
//         console.log('A user connected', socket.user.userId);

//       socket.on('private message', ({to, message}) => {

//       })
//     })

// })
// }

export const createChat = async (req, res, next) => {
  const { participants } = req.body;
  try {
    // Check if a chat with the same participants already exists
    const existingChat = await Chat.findOne({
      participants: { $all: participants, $size: participants.length },
    });
    if (existingChat) {
      return res.status(200).json({
        success: true,
        data: existingChat,
      });
    }
    const chat = await Chat.create({
      participants,
    });

    res.status(200).json({
      success: true,

      data: chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getChatList = async (req, res, next) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat.participants || chat.participants.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Chat does not have exactly 2 participants",
      });
    }
    console.log("chat", chat);
    const chatPopulate = await chat
    .populate({
        path: "participants",
        select: "firstName lastName profileUrl location profession",
      })
      
    
    const [participant1, participant2] = chat.participants;


    const otherParticipant =
      participant1._id.toString() === userId
        ? participant2._id
        : participant1._id;
    console.log(otherParticipant);

    const user = await Users.findById(userId);
    
    const recipient = await Users.findById(otherParticipant);
    const isRecipientExists = user.chatRecipients.some(
      (recipient) => recipient._id.toString() === otherParticipant.toString()
    );
    const isRecipientsExists = recipient.chatRecipients.some(
      (recipient) => recipient._id.toString() === otherParticipant.toString()
    );

    if (!isRecipientExists) {
      if (user) {
        user.chatRecipients.push({
          participant: otherParticipant,
          chatId: chatId,
        });
        await user.save();
        
      }
    }

    if (!isRecipientsExists) {
      if (recipient) {
        recipient.chatRecipients.push({
          participant: userId,
          chatId: chatId,
        });
        await recipient.save();
       
      }
    }

    res.status(200).json({
      success: true,
      recipient,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const sendMessage = async (req, res, next) => {
  const { chatId } = req.params;
  const { sender, recipient, content } = req.body;
 
  try {
    const newMessage = await Message.create({
      chat: chatId,
      sender,
      recipient,
      content,
    });
    await newMessage.save();
    const chat = await Chat.findById(chatId);
    chat.messages.push(newMessage._id);
    await chat.save();
    res.status(200).json({
      success: true,

      data: newMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getMessage = async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate({
      path: "messages",
      populate: {
        path: "sender recipient",
        select: "firstName lastName profileUrl",
      },
    });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
