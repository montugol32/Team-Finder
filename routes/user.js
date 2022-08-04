const express = require("express")
const { signup, signin, signout } = require("../controllers/user")
const {check} = require('express-validator')
const router = express.Router()
const Users=require('./../models/user')

router.get('/home',async(req,res)=>{
  const users=await Users.find();
  res.render('api/home',{users: users});
})

router.get('/signup',(req,res)=>{
  res.render('api/signup',{});
})


router.post('/signup', [
  check("name", "Name atleast should be 3 characters").isLength({min: 3}),
  check("email", "Email should be valid").isEmail(),
  check("password", "Password at least should be 6 characters").isLength({min: 6}),
  check("college_name", "college_name required").isLength({min: 4}),
  check("interest", "Interest are required").isLength({min: 6}),
  
] ,signup)

router.get('/signin',(req,res)=>{
  res.render('api/signin');
})
router.post('/signin', signin)

router.get("/signout", signout)

module.exports = router