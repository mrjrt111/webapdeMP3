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

    console.log("BODY: ", req.body);
    console.log("Title: ", title, " Note: ", note);
    var checklistJSON = [];
    for(var i in checklistStrings) {

        var item = checklistStrings[i];

        checklistJSON.push({
            "task" : item,
            "status"  : false
        });
    }
    console.log("ChecklistSchema Array: ", checklistJSON);

        var noteContent = {title: title, username: username, note: note, checklist: checklistJSON};
        Content.createContent(noteContent).then(()=>{
                res.redirect("/");
        });


})
module.exports = router;