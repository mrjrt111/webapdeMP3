const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")

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

    var noteContent = {title: title, username: username, note: note};
    Content.createContent(noteContent);
})