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
    image: String
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

        //console.log(content);
    })
}

exports.editContent = function(oldContent, newContent){
    return new Promise(function(resolve, reject){
        console.log("Edit Content ",oldContent, " to ", newContent);

        Content.findOneAndUpdate(oldContent,  newContent).then(()=>{

        })


    })
}

exports.loadUserContent  = function (username){
    return new Promise(function(resolve, reject){
        console.log("in promise : " + username)
        Content.find({
            username : username
        }).then((userContents)=>{
            //console.log("List of content : " + userContents)
            resolve(userContents)
        },(err)=>{
            reject(err)
        })
    })
}

exports.findOneContent = function (id){
    return new Promise(function(resolve, reject){
        console.log("in promise : ")
        Content.findOne({
            _id : id
        }).then((userContents)=>{
            console.log("List of content : " + userContents)
            resolve(userContents)
        },(err)=>{
            reject(err)
        })
    })
}

exports.loadContentByTitle = function (title, username){
    return new Promise(function(resolve, reject){
        console.log("in promise Title : " + title + " "+ username)
        Content.find({
            title : title,
            username: username
        }).then((userContents)=>{
            console.log("List of contentoc1  : " + userContents)
            resolve(userContents)
        },(err)=>{
            reject(err)
        })
    })
}

exports.loadContentByTag = function (tag, username){
    return new Promise(function(resolve, reject){
        console.log("in promise : " + tag + " "+ username)
        Content.find({
            tag : tag,
            username: username
        }).then((userContents)=>{
            console.log("List of content : " + userContents)
            resolve(userContents)
        },(err)=>{
            reject(err)
        })
    })
}

exports.deleteContent = function (id){
    return new Promise(function(resolve, reject){
        //console.log("in promise : " + tag + " "+ username)
        Content.deleteOne({_id: id
        }).then((userContents)=>{
            console.log("Deleted: ",  userContents.n)
        },(err)=>{
            reject(err)
        })
    })

}

exports.getUsersNotes  = function (username){
    return new Promise(function(resolve, reject){
        console.log("in promise : " + username)
        Content.find({
            title:  { $ne: "" },
            note: { $ne: "" }
        }).then((userContents)=>{
            //console.log("List of content : " + userContents)
            resolve(userContents)
        },(err)=>{
            reject(err)
        })
    })

}





