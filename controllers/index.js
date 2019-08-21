const express = require("express")
const router = express.Router()
const app = express()
const path = require('path')
const session = require("express-session")
const User = require("../models/User")
const Content = require("../models/Content")


router.use("/user", require("./UserController.js"))
router.use("/content", require("./ContentController.js"))

    router.get("/", function (req,  res) {
        var directory = path.join(__dirname,  '../public/login.html')
        console.log(directory)
        if (!req.session.username) {
            res.sendFile(directory);
        } else {
            Content.loadUserContent(req.session.username).then((content)=>{
                res.render("home.hbs", {
                    notes: content
                })
               // console.log("This is Content:", content);
            })
        }
})
module.exports = router
