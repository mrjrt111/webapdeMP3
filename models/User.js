const mongoose = require('mongoose');
const crypto = require('crypto');

var userSchema = mongoose.Schema({
    username: String,
    password: String
})

userSchema.pre("save", function(next){
    this.password = crypto.createHash("md5").update(this.password).digest("hex");
    next();
})


var User = mongoose.models("users", userSchema);

exports.signup = function (user){
    return new Promise(function(resolve, reject){
        console.log(user);
        var u = new User(user);

        u.save().then((newUser)=>{
            console.log(newUser);
            resolve(newUser);
        }, (err)=>{
            reject(err)
        })
    })
}

exports.login = function(user){
    return new Promise(function(resolve, reject){
        console.log("in promise : " + user.username)
        User.findOne({
            username : user.username,
            password : crypto.createHash("md5").update(user.password).digest("hex")
        }).then((user)=>{
            console.log("callback user : " + user)
            resolve(user)
        },(err)=>{
            reject(err)
        })
    })
}

exports.getById = function(id){
    return new Promise(function(resolve, reject){
        User.findOne({_id:id}).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.getByUsername = function(username){
    return new Promise(function(resolve, reject){
        User.findOne({username: username}).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}