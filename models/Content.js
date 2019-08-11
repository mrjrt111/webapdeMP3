const mongoose = require('mongoose');
const crypto = require('crypto');

const checklistSchema = new Schema({
    task: String,
    status: Boolean
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
