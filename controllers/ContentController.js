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

router.post("/createnotes",upload.single("img"), (req, res)=>{
    console.log("REQ:", req.file);
    let title = req.body.note_title;
    let note = req.body.note_content;
    let username = req.session.username;
    let checklistStrings = req.body.listitem;
    let tagString = req.body.tag;
    let image = req.file.filename;

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
    let id = req.body.note_id;
    let title = req.body.note_title;
    let note = req.body.note_content;
    let username = req.session.username;
    let checklistStrings = req.body.listitem;
    let tagString = req.body.newTag;

    console.log(req.body);
    var checklistJSON = [];
    for(var i in checklistStrings) {

        var item = checklistStrings[i];

        checklistJSON.push({
            "task" : item,
            "status"  : false
        });
    }
    console.log(title, " ", note);
    Content.editContent({_id: id},  {title: title, username: username, note: note,
        checklist: checklistJSON, tags: tagString}).then((content)=>{
                 res.redirect("/");
    })
    res.redirect("/");
})

router.post("/deletenote",  urlencoder, (req, res)=>{
    let id = req.body.note_id;
    Content.deleteContent(id);
    res.redirect("/");
})

router.post("/searchTitle", urlencoder, (req, res)=>{
    let title = req.body.searchBar;
    let username = req.session.username;
    console.log("Title: ");
    Content.loadContentByTitle(title, username).then((content)=>{
        console.log(content);
        res.render("home.hbs", {
            notes: content

        })
    })
})

router.post("/home", function (req, res) {
    res.redirect("/");
})


router.post("/notes", function (req, res) {
    console.log("in notes")
    Content.getUsersNotes(req.session.username).then((content)=>{
        console.log("In notes router ", content);
        res.render("home.hbs", {
            notes: content
        })
    })
})


router.post("/checklists", function (req, res) {
    console.log("in checklist")
    Content.getUsersChecklist(req.session.username).then((content)=>{
        console.log("In notes router ", content);
        res.render("home.hbs", {
            notes: content
        })
    })
})
/*router.post("/checklists", function (req, res) {
    console.log("in checklists")
    Content.getUserChecklists(req.session.username).then((content)=>{
        console.log("In checklists router ", content);
        res.render("home.hbs", {
            checklists: content
        })
    })
})*/

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = router;