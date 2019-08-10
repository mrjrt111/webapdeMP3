const mongoose = require('mongoose');
const crypto = require("crypto");

var userSchema = mongoose.Schema({
    username: String,
    password: String
})

userSchema.pre("save", function(next){
    this.password = crypto.createHash("md5").update(this.password).digest("hex")
    next()
})

var User = mongoose.models("users", userSchema);