const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")
const fs = require('fs')
const multer = require("multer")
const path = require("path")
const User = require("../models/User")
const Content = require("../models/Content")
const  UPLOAD_PATH = 'uploads/';

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

router.post("/createnotes",upload.single("img"), (req, res, next)=>{
    console.log("REQ:", req.file);
    let title = req.body.note_title;
    let note = req.body.note_content;
    let username = req.session.username;
    let checklistStrings = req.body.listitem;
    let  checkboxes = req.body.listcheckboxes;
    let tagString = req.body.tag;
    let image = null;
    if (req.file!= null)
         image= req.file.filename;

    for(var i in req.body.listcheckboxes){
        if(req.body.listcheckboxes[i]==="true")
            checkboxes[i] = true;
        else
            checkboxes[i]=false;
    }

    console.log("Body: ", req.body)
    var checklistJSON = [];
    for(var i in checklistStrings) {

        var item = checklistStrings[i];

        checklistJSON.push({
            "task" : item,
            "status"  : checkboxes[i]
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

    if (note&&title){
        var noteContent = {title: title, username: username, note: note, tags: tagString,  image: image};
        Content.createContent(noteContent).then(()=>{
            res.redirect("/");
        });
    }

    else if (title&&checklistJSON){
        var noteContent = {title: title, username: username, note: note, checklist: checklistJSON, tags: tagString};
        Content.createContent(noteContent).then(()=>{
            res.redirect("/");
        });

    }
    else{
        res.redirect("/");
    }






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

router.post("/editnote", upload.single("img"), (req, res)=>{
    let id = req.body.note_id;
    let title = req.body.note_title;
    let note = req.body.note_content;
    let username = req.session.username;
    let checklistStrings = req.body.listitem;
    let tagString = req.body.tag;
    let  checkboxes = req.body.listcheckboxes;
    console.log("REQ: ", req.file)
    let image = null;
    if (req.file!= null)
        image= req.file.filename;

    for(var i in req.body.listcheckboxes){
        if(req.body.listcheckboxes[i]==="true")
            checkboxes[i] = true;
        else
            checkboxes[i]=false;
    }

    var checklistJSON = [];
    for(var i in checklistStrings) {

        var item = checklistStrings[i];


        checklistJSON.push({
            "task" : item,
            "status"  : checkboxes[i]
        });
    }
    console.log(image, "this is image ");

    if (image!=null){
        console.log("Image is not null")
        Content.editContent({_id: id},  {title: title, username: username, note: note, image: image,
            checklist: checklistJSON, tags: tagString}).then((content)=>{
            res.redirect("/");
        })
    }

    else{
        console.log("Image is null")
        Content.editContent({_id: id},  {title: title, username: username, note: note,
            checklist: checklistJSON, tags: tagString}).then((content)=>{
            res.redirect("/");
        })
    }
    res.redirect("/");
})

router.post("/deletenote",  urlencoder, (req, res)=>{
    let id = req.body.note_id;
    Content.deleteContent(id);
    res.redirect("/");
})

router.post("/searchPhrase", urlencoder, (req, res)=>{
    let title = req.body.searchBar;
    let username = req.session.username;
    console.log("Title: ");
    Content.searchItems(title, username).then((content)=>{
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

router.get("/uploads/:id", (req, res)=>{
    console.log("Retrieving Photo");
    id = req.params.id;
    console.log(req.params.id, "  This is the id");
    Content.getImageById(id).then((doc)=>{
        fs.createReadStream(path.resolve(UPLOAD_PATH, doc.image)).pipe(res)
    }, (err)=>{
        console.log(err)
        res.sendStatus(404)
    })
})

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


module.exports = router;