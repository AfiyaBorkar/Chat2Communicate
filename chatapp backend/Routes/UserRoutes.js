const express= require("express");
const router=express.Router();

const {loginController,registerController,fetchAllUsersController} = require("../Controllers/UserControllers");
const protect = require("../Middleware/AuthMiddleware")

router.post('/login',loginController)
router.post('/register',registerController)
router.get('/fetchUsers',protect,fetchAllUsersController);

module.exports=router