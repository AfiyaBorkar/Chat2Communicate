const express= require("express");
const router=express.Router();

const {accessChats,createGroupChat,fetchChats,fetchGroupChats,groupExist,addSelfToGroup,removeUserFromChat} = require("../Controllers/ChatController");
const protect = require("../Middleware/AuthMiddleware")

router.route("/").post(protect, accessChats);
router.route("/").get(protect, fetchChats);
router.route("/createGroup").post(protect, createGroupChat);
router.route("/fetchGroups").get(protect, fetchGroupChats);
router.route("/groupExit").put(protect, groupExist);
router.route("/addtoGroup").put(protect, addSelfToGroup);
router.route("/existChat/:chatId").put( removeUserFromChat);

module.exports=router