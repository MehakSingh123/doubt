if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { listingschema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing");
const WrapAsync = require("./utilis/WrapAsync");
const Review = require("./models/review");
const ExpressError = require("./utilis/ExpressError");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const port = 8080;
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
const session =require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const userrouter=require("./routes/user.js");
// Connect to MongoDB
async function main() {
    await mongoose.connect(Mongo_Url);
    console.log("Connected to DB");
}
main().catch(err => console.error(err));

// Express app setup
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionupdate={
    secret:"supersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
app.use(session(sessionupdate));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});
app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"student@gmail.com",
        username:"delta-student"
    });
    let registeredUser=await User.register(fakeuser,"helloworld");
    res.send(registeredUser);

})
// Routes
app.use("/listings",listings);
// Reviews Routes
app.use("/listings/:id/reviews",reviews);
app.use("/",userrouter);

// CATCH-ALL ROUTE
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// ERROR-HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("./listings/error.ejs", { message });
});

// Start the server
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
