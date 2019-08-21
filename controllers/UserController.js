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
    var isDuplicate = false;

    if (password ===confirm_pw){
        User.getByUsername(username).then((user)=>{
            console.log(user);
            isDuplicate = !isEmpty(user)
            console.log("isDuplicate = ", isDuplicate)

            if (!isDuplicate){
                console.log("isDuplicate under condition = ", isDuplicate)
                console.log("POST /user/register");
                var user = {username : username, password : password}

                User.addUser(user).then((user)=>{
                    console.log("successful added " + user);
                    req.session.username = user.username;
                    res.render("home.hbs", {
                        // username: doc.username
                    })
                },(error)=>{
                    res.render("home", {
                        error : "some error in registering: " + error
                    })
                })
            }
            else{
                console.log("This is a duplicate username")
                res.redirect("/signup.html");
            }

        })


    }
    else {
        console.log("Non matching passwords")
        res.redirect("/signup.html");
    }
})

router.post("/login", urlencoder, (req, res)=>{
    console.log("LOG-IN");

    var user =  {username : req.body.user, password : req.body.pass};

   User.loginUser(user).then((foundUser)=>{
       if (foundUser){
           req.session.username = user.username;
           Content.loadUserContent(user.username).then((content)=>{
               res.render("home.hbs", {
                   notes: content
               })
           })
           console.log(user.username, " has been found");
           res.render("home")
       }
   }), (error)=>{
       console.log(error)
    }


})

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
module.exports = router;
