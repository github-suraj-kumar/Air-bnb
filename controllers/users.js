const User = require("../models/user")

module.exports.renderSignupForm = (req,res)=>{
    res.render("user/form.ejs")
}

module.exports.signup = async(req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newuser = new User({username,email});
       const registeruser = await User.register(newuser,password);
      req.login(registeruser,(err)=>{
        if(err){
            next(err)                                                                  
        }
        req.flash("success","Welcome to Wonderlust");
        res.redirect("/listings")
      })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
  
}

module.exports.loginForm =(req,res)=>{
    res.render("user/login.ejs")
}

module.exports.login = async (req,res)=>{
    // req.flash("success","Welcome back to Wonderlust! ");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
   
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are sucessfully Logout")
    res.redirect("/listings")
    })
    
}