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
    let readImage = fs.readFileSync(req.file.path);
    let encImg = readImage.toString('base64');

    if (title===null && note===null);

    else {
        if (image===null)
            var noteContent = {title: title, username: username, note: note};

        else
            var noteContent = {title: title, username: username, note: note, image: Buffer(encImg, 'base64')};

        Content.createContent(noteContent);
    }

})
module.exports = router;