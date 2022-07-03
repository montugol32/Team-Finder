const User = require("../models/user")
const {validationResult} = require('express-validator')
const user = require("../models/user")
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const multer= require('multer')

const { diskStorage } = require("multer")

const storage=multer.diskStorage({

  destination:function(request,file,callback){

    callback(null,'./public/upload/images')
  },
  filename:function (request,file,callback){
    callback(null,Date.now()+file.originalname)

  }

});

const upload= multer({

  storage: storage,
  limits:{
    fileSize: 1024*1021*3,
  },
});


exports.signup = upload.single('image'),async(req, res) => {
    
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg
    })
    }
  console.log(req.body);
  const user = new User(req.body)
  user.save((err, user) => {
    if(err) {
      return res.status(400).json({
        error: "Unable to add user"
      })
    }

    // return res.json({
    //   message: "Success",
    //   user
    // })
    
    res.redirect('/api/home')
  })
}


exports.signin = (req, res) => {
  const {email, password} = req.body

  User.findOne({email}, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: "Email was not found"
      })
    }

    // Authenticate user
    if(!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match"
      })
    }

    // Create token
    const token = jwt.sign({_id: user._id}, process.env.SECRET)

    // Put token in cookie
    res.cookie('token', token, {expire: new Date() + 1})

    // Send response
    const {_id, name, email} = user
    
    // return res.json({
    //   token,
    //   user: {
    //     _id,
    //     name,
    //     email
    //   }
    // })
    
    res.redirect('/api/home')
    
  })
}

exports.signout = (req, res) => {
  res.clearCookie("token")
  return res.json({
    message: "User siginout successful"
  })
}