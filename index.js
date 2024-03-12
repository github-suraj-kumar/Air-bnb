 if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
 }
      
 
 
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require('./routes/user.js')
const session = require('express-session');
const MongoStore = require("connect-mongo")
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

 
const mongo = process.env.LINK
mongoose.connect(mongo).then(()=>{
    console.log("Db is connected")
}).catch((err)=>{
    console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:mongo,
    crypto:{
        secret:process.env.SESSION_SECRET,
    },
    touchAfter:24*3600,
})
 
store.on("error",()=>{
    console.log("Error on mongostore",err)
})

app.use(session({
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.curruser = req.user;
    next();
})

app.use("/listings",listingRoute);
app.use("/listings/:id/review",reviewRoute);
app.use("/",userRoute)

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
});

app.use((err,req,res,next)=>{
let {statusCode=500,message="Something went wrong"} = err;
res.render("err",{err});
})


app.listen(2100,()=>{
    console.log("srever is started");
})  