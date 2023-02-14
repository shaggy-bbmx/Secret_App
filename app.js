//jshint esversion:6
require("dotenv").config();
const express = require("express"); 
const app = express(); 
const bodyParser = require("body-parser"); 
const ejs = require("ejs"); 
const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});
const encrypt=require("mongoose-encryption");

app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true})); 
app.listen(3000, function() { 
    console.log("Server started on port 3000"); 
});

const userScheme=new mongoose.Schema({
    email:String,
    password:String
});

 

userScheme.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userScheme);

app.get("/",(req,res)=>{ 
    res.render("home"); 
});

app.get("/login",(req,res)=>{ 
    res.render("login"); 
});

app.post("/login",(req,res)=>{
    User.findOne({email:req.body.username,password:req.body.password},(err,results)=>{
        if(results)res.render("secrets");
    });
});

app.get("/register",(req,res)=>{ 
    res.render("register"); 
});

app.post("/register",(req,res)=>{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save((err)=>{
        if(err)console.log(err);
        else res.render("secrets");
    });
});



