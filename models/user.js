const mongoose = require("mongoose")
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    trim: true,
    required: true
  },
  college_name: {
    type: String,
    trim: true,
    required: true
  },
  skill: [{
    type: String,
    trim: true,

  }],
  encry_password: {
    type: String,
    required: true
  },about_me: {
    type: String,
    trie: true,
  },linkedin: {
    type: String,
    trie: true
  }, github: {
    type: String,
    trie: true,
  },
  salt: String,
}, {timestamps: true})

userSchema.virtual("password")
  .set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.encry_password = this.securePassword(password)
  })
  .get(function() {
    return this._password
  })

  
userSchema.virtual("interest")
  .set(function(interest) {
    this.skill=interest.split(',');
    
    console.log(this.skill)
  
  })

userSchema.methods = {
  authenticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password
  },

  securePassword: function(plainpassword) {
    if(!plainpassword) return "";

    try {
      return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex")
    } catch (err) {
      return ""
    }
  }
}

module.exports = mongoose.model("User", userSchema)