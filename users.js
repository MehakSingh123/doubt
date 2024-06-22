const User=require("../models/user.js");
module.exports.rendersignupform=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try{    
    let {username,email,password}=req.body;
    let newuser=new User({username,email});
    let registeredUser=await User.register(newuser,password);
    req.login(registeredUser,(err)=>{
      if(err){
        next(err);
      }
      req.flash("success","You successfully Signed-Up");
      res.redirect("/listings");

    })
    console.log(registeredUser);
    
}
catch(err){
  req.flash("error","User already exists");
  res.redirect("/signup");
}

};
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to wanderlust!!");
    let newkey= res.locals.redirectUrl || "/listings";
    res.redirect(newkey);
 }
 module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
      if(err){
        return next(err);
      }
      req.flash("error","You successfully logged out");
        res.redirect("/listings");
    });
}