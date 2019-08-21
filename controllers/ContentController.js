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
    console.log("Body ", req.body);
    console.log("Title: ", title, " Note: ", note);
    let readImage;
    if (req.file!=null){
        readImage = fs.readFileSync(req.file.path);
        let encImg = readImage.toString('base64');
        var noteContent = {title: title, username: username, note: note, image: Buffer(encImg, 'base64')};
        Content.createContent(noteContent);
        Content.loadUserContent(username).then((content)=>{
            res.render("home.hbs", {
                notes: content
            })
        })
    }
    else {
        var noteContent = {title: title, username: username, note: note};
        Content.createContent(noteContent);
        Content.loadUserContent(username).then((content)=>{
            res.render("home.hbs", {
                notes: content
            })
        })


    }






})
module.exports = router;