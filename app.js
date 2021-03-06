const express = require("express")
const bodyparser = require("body-parser")
const hbs = require("hbs")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")
const CONNECTION_URI = process.env.MONGODB_URI|| '//mongodb://localhost:27017/checknotes';
const multer = require("multer")
const app = express()
const fs = require('fs');
const  UPLOAD_PATH = 'uploads/';
const upload = multer({
    dest: UPLOAD_PATH,
    limits: {
        fileSize : 10000000,
        files : 1
    }
})


mongoose.Promise = global.Promise
mongoose.connect(CONNECTION_URI, {//mongodb://localhost:27017/checknotes
    useNewUrlParser:true
})
mongoose.connection.once('open', ()=>{
    console.log("Connection to CheckNotes database has been successful ")
}).on('error', (error)=>{
    console.log('Connection error: ', error);
})

const urlencoder = bodyparser.urlencoded({
    extended: false
});
app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"))
app.use(
    session({
        secret: "secretname",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 2
        }
    })
);
app.use(cookieparser())

app.use(require("./controllers"))

app.listen(process.env.PORT || 3000, function () {
    console.log("port is live at 3000");
});

