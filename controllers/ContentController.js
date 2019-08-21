const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")
const fs = require('fs')
const multer = require("multer")
const User = require("../models/User")
const Content = require("../models/Content")


//const UPLOAD_PATH = path.resolve(__dirname+ "../uploads")
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize : 10000000,
        files : 1
    }
})

const urlencoder = bodyparser.urlencoded({
    extended : true
})
router.use(urlencoder)

router.post("/createnotes",upload.single("note_image"), (req, res)=>{
   // console.log("REQ:", req);
    let title = req.body.note_title;
    let note = req.body.note_content;
    let username = req.session.username;
    let checklistStrings = req.body.listitem;
    let tagString = req.body.tag;

    console.log("Body: ", req.body)
    var checklistJSON = [];
    for(var i in checklistStrings) {

        var item = checklistStrings[i];

        checklistJSON.push({
            "task" : item,
            "status"  : false
        });
    }
    var tagJSON = [];
    for (var j in tagString){
        var item = tagString[j];
        tagJSON.push({
            tags: item
        })
    }
    console.log("Tag String: ", tagString);

    if (note&&title)
        var noteContent = {title: title, username: username, note: note, tags: tagString};
    else if (title&&checklistJSON)
        var noteContent = {title: title, username: username, note: note, checklist: checklistJSON, tags: tagString};

        Content.createContent(noteContent).then(()=>{
                res.redirect("/");
        });


})

router.get("/:id", urlencoder, (req, res)=>{
    let id = req.body.id;
    Content.findOneContent("5d5d369dc54cc23c802348e8").then((content)=>{
        console.log(content);
        res.send(content);
    }),(err)=>{
        console.log(err);
    }

});

router.post("/editnote", urlencoder, (req, res)=>{
    let id = "something";
    let title = req.body.note_title;
    let note = req.body.note_content;
    let username = req.session.username;
    let checklistStrings = req.body.listitem;
    let tagString = req.body.newTag;
    Content.editContent({_id: id},  {title: title, username: username, note: note,
        checklist: checklistJSON, tags: tagJSON}).then((content)=>{
                 res.redirect("/");
    })


})

module.exports = router;