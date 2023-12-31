const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: {
    type: String,
    trim: true,
  },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat"  },
},{
    timestamp:true
});

const message = mongoose.model("Message", messageSchema);
module.exports = message;
