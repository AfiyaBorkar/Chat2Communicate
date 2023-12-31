const express= require("express");
const router=express.Router();

const {allMessages,sendMessage} = require("../Controllers/MessageControllers");
const protect = require("../Middleware/AuthMiddleware")


router.route("/:chatId").get(protect,allMessages)
router.route("/").post(protect,sendMessage)
module.exports=router