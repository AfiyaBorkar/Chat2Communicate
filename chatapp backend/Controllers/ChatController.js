const UserModel = require("../modals/UserModel");
const ChatModel = require("../modals/ChatModel");

const expresshandler = require("express-async-handler");

const removeUserFromChat = expresshandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    console.log("ChatId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    // Check if the current user is part of the chat
    const chat = await ChatModel.findOne({
      _id: chatId,
      isGroupChat: false,
      users: req.user._id,
    });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found or user not part of the chat." });
    }

    // Remove the user from the chat
    await ChatModel.updateOne(
      { _id: chatId },
      { $pull: { users: req.user._id } }
    );

    res.status(200).json({ message: "User removed from the chat." });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const accessChats = expresshandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestmessage");

  isChat = await UserModel.populate(isChat, {
    path: "latestmessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await ChatModel.create(chatData);
      const FullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = expresshandler(async (req, res) => {
  try {
    // console.log("Fetch Chats aPI : ", req);
    ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestmessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: "latestmessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// const createGroupChat = expresshandler(async (req, res) => {
//   if (!req.body.users || !req.body.name) {
//     console.log("Data is not sufficient");
//   }

//   // console.log("chatcontroller/creatchat: ", req);

//   const users = JSON.parse(req.body.users);

//   // Add req.user to the list of users
//   users.push(req.user);
//   try {
//     const existingGroup = await ChatModel.findOne({ chatName: req.body.name });

//     if (existingGroup) {
//       res
//         .status(409)
//         .json({ message: `Group "${req.body.name}" already exists.` });
//     } else {
//       const createGroup = await ChatModel.create({
//         chatName: req.body.name,
//         isGroupChat: true,
//         groupAdmin: req.user, // Use req.user for the creator
//         users: users,
//       });

//       const FullGroupChat = await ChatModel.find({ _id: createGroup._id })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");

//       res.status(200).json(FullGroupChat);
//     }
//   } catch (e) {
//     res.status(400);
//     throw new Error(e.message);
//   }
// });

const createGroupChat = expresshandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    console.log("Data is not sufficient");
  }

  // No need to parse req.body.users if it's a single user
  const user = req.body.users;

  // Add req.user to the list of users
  // (assuming req.user is a valid user identifier)
  const users = [req.user, user];

  try {
    const existingGroup = await ChatModel.findOne({ chatName: req.body.name });

    if (existingGroup) {
      res
        .status(409)
        .json({ message: `Group "${req.body.name}" already exists.` });
    } else {
      const createGroup = await ChatModel.create({
        chatName: req.body.name,
        isGroupChat: true,
        groupAdmin: req.user,
        users: users,
      });

      const FullGroupChat = await ChatModel.find({ _id: createGroup._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(FullGroupChat);
    }
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});


const fetchGroupChats = expresshandler(async (req, res) => {
  try {
    const allgroupChats = await ChatModel.where("isGroupChat").equals(true);
    res.status(200).send(allgroupChats);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

const groupExist = expresshandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removeUser = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  );

  if (!removeUser) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(removeUser);
  }
});

const addSelfToGroup = expresshandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const addToGroup = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addToGroup) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(addToGroup);
  }
});

module.exports = {
  accessChats,
  fetchChats,
  createGroupChat,
  fetchGroupChats,
  groupExist,
  addSelfToGroup,
  removeUserFromChat,
};
