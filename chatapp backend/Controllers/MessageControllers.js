const express = require("express");
const UserModel = require("../modals/UserModel");
const ChatModel = require("../modals/ChatModel");
const MessageModel = require("../modals/MessageModel");

const expresshandler = require("express-async-handler");

const allMessages = expresshandler(async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("receiver")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = expresshandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed in the request");
    return res.status(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await MessageModel.create(newMessage);
    console.log(message);
    message = await message.populate("sender", "name pic");
    message = await message.populate("receiver");
    message = await message.populate("chat");

    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestmessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
