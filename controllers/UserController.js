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

router.post("/signup", urlencoder, (req, res)=>{
    console.log("AT SIGN UP");
    var username = req.body.user;
    var password = req.body.pass;
    var confirm_pw = req.body.confirm_pw;

    if (password ===confirm_pw){
        console.log("POST /user/register");
        var user = {username : req.body.user, password : req.body.pass}

        User.addUser(user).then((user)=>{
            console.log("successful added " + user);
            req.session.username = user.username;
            Content.loadUserNotes(user.username).then((notes)=>{
                if (notes.size===0)
                    console.log("No notes  yet")
                else
                    console.log("notes:  ", notes)
            })
            res.render("home.hbs", {
                username: doc.username
            })
        },(error)=>{
            res.render("home", {
                error : "some error in registering: " + error
            })
        })
    }
    else
    {
        res.redirect("/signup")
    }
})

router.post("/login", urlencoder, (req, res)=>{
    console.log("LOG-IN");

    var user =  {username : req.body.user, password : req.body.pass};

   User.loginUser(user).then((foundUser)=>{
       if (foundUser){
           req.session.username = user.username;
           Content.loadUserNotes(user.username).then((notes)=>{
               if (notes.size===0)
                   console.log("No notes  yet")
               else
                   console.log("notes:  ", notes)
           })
           console.log(user.username, " has been found");
           res.render("home")
       }
   }), (error)=>{
       console.log(error)
    }


})
module.exports = router;
