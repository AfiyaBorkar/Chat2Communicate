const express = require("express");
const UserModel = require("../modals/UserModel");
const generateToken = require("../Config/TokenCreation");

const expresshandler = require("express-async-handler");

const loginController = expresshandler(async (req, res) => {
  const { name, password } = req.body;
//   if (!name || !password) {
//     res.send("All the input fiels must be filled");
//   }
  const user = await UserModel.findOne({ name });
  if (user && (await user.matchPassword(password))) {
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };
    console.log(response);
    res.status(200);
    res.json({ data: response,message: "Login Successs",  });
  } else {
    res.status(404);
    throw new Error("Wrong username or password");
  }
});

const registerController = expresshandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(405).json({message:"All input fields should be filled"});

  }
  const userExist = await UserModel.findOne({ name });
  if (userExist) {
    res.status(401)
    throw Error("user already exist");
  }

  const userEmailExist = await UserModel.findOne({ email });
  if (userEmailExist) {
    res.status(402)
    throw new Error("Use Different email");
  }

  const user = await UserModel.create({ name, email, password });
  if (user) {
    res.status(200);
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };
    res.json({ data: response, message: "User Added" });
    console.log(response);
  } else {
    res.status(400);
    throw new Error("Registration Error");
  }
});


// const fetchUsersController=expresshandler(async(req,res)=>{
//     const keyword=req.query.search
//     ? {

//         $or:[{name:{$regex:req.query.search,$options:"i"}},{email:{$regex:req.query.search,$options:"i"}}]
//     }:{};
//     const user = await UserModel.find(keyword).find({
//         _id: {$ne:req.user._id},
//     });
//     res.send(user);

// })

// const fetchAllUsersController = expresshandler(async (req, res) => {
//   try {
   
//   } catch (error) {
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// });
const fetchAllUsersController = expresshandler(async (req, res) => {
  try {
    console.log("Starting fetchAllUsersController");
    const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
    // ... rest of your code ...

    console.log("Fetching users successfully");

    // res.send(users);
  } catch (error) {
    console.error("Error in fetchAllUsersController:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = { loginController, registerController,fetchAllUsersController };
