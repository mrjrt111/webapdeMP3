const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")
const fs = require('fs')

const User = require("../models/User")
const Content = require("../models/Content")

const urlencoder = bodyparser.urlencoded({
    extended : true
})
router.use(urlencoder)

router.post("/createnotes", urlencoder, (req, res)=>{
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

router.get("/:id", urlencoder, (req, res)=>{
    Content.findOneContent(id).then((content)=>{
    })
});

module.exports = router;