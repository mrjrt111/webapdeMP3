const express = require("express")
const router = express.Router()
const app = express()
const path = require('path')
const session = require("express-session")


router.use("/UserController", require("./UserController.js"))

    router.get("/", function (req,  res) {
        var directory = path.join(__dirname,  '../public/login.html')
        console.log(directory)
        if (!req.session.username) {
            res.sendFile(directory);
        } else {
            res.render("home.hbs", {
            username: req.session.username
        });
    }
})
module.exports = router
