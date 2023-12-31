const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Routes/UserRoutes");
const chatRouter = require("./Routes/ChatRoutes");
const messageRouter = require("./Routes/MessageRoutes");
const socket = require("socket.io");
dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json());
const port = process.env.PORT || 5000;

mongoose.set("strictQuery", false);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Server got connected");
  } catch (err) {
    console.log(`DB Server got error ${err.message}`);
  }
};

connectDb();

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
  res.send("App is running");
});

const server = app.listen(port, () => {
  console.log(`App is listening on port no ${port}`);
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
  // pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("set-up", (user) => {
    socket.join(user.data._id);
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
  });

  socket.on("new-message", (newmessageStatus) => {
    try {
      
      const chat= newmessageStatus.newMessage.chat;

      if (!chat.users) {
        console.log("chats.user USers not defined");
      }
      // console.log("now usrs:",newmessageStatus)
        // socket.in(user._id).emit("message received", newmessageStatus);
console.log("chat",chat)
      chat.users.forEach((user) => {
        if (user._id === newmessageStatus.newMessage.sender._id) {
          return
        }
        
        socket.in(user._id).emit("message received", newmessageStatus);
        console.log("456789")

        console.log("id",user._id)

        
        
      });

    } catch (error) {
      console.error("Error handling new message:", error);
    }
  });

//   socket.on("new-message", (newMessageStatus) => {
//     try {
//       const { chat, sender, newMessage } = newMessageStatus;

//       if (!chat || !chat.users) {
//         throw new Error("Invalid chat or chat users");
//       }

// console.log("now chat",chat)
//       chat.users.forEach((user) => {
//         if (user._id !== sender._id) {
//           io.to(user._id).emit("message received", newMessage);
//         }
//       });
//     } catch (error) {
//       console.error("Error handling new message:", error);
//     }
//   });


  // socket.on("disconnect", () => {
  //   console.log(`Socket disconnected: ${socket.id}`);
  //   // Perform any cleanup or additional logic on socket disconnect
  // });
});
