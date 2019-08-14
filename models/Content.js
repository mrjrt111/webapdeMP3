const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const checklistSchema = new Schema({
    task: String,
    status: false
})
var contentSchema = mongoose.Schema({
    title: String,
    username: String,
    note: String,
    checklist: [checklistSchema],
    tags: [String],
    images: Buffer
})

var Content = mongoose.model("contents", contentSchema);

exports.createContent = function (content){
    return new Promise(function(resolve, reject){
        console.log(content);
        var u = new Content(content);

        u.save().then((newContent)=>{
            console.log(newContent);
            resolve(newContent);
        }, (err)=>{
            reject(err)
        })
    })
}

exports.loadUserContent  = function (username){
    return new Promise(function(resolve, reject){
        console.log("in promise : " + username)
        Content.find({
            username : username
        }).then((userContents)=>{
            console.log("List of content : " + userContents)
            resolve(userContents)
        },(err)=>{
            reject(err)
        })
    })
}



