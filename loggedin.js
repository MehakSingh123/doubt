const { Cursor } = require("mongoose");
const Listing = require("./models/listing");
const { listingschema } = require("./schema.js");
const ExpressError = require("./utilis/ExpressError");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review");

module.exports.loggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not logged in");
        return res.redirect("/login");  // Add return here
    }
    next();
};

module.exports.saveredirecturl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }

    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateschema = (req, res, next) => {
    const { error } = listingschema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(ele => ele.message).join(",");
        next(new ExpressError(400, errmsg));
    } else {
        next();
    }
};

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(ele => ele.message).join(",");
        next(new ExpressError(400, errmsg));
    } else {
        next();
    }
};

module.exports.isreviewauthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
