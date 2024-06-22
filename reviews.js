const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.createreview=async (req, res, next) => {
    const { id } = req.params;
    console.log(req.params.id);
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
   let newReview = new Review(req.body.review);
   newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review added");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.deletereview=async (req, res) => {
    let { id, reviewId } = req.params;
    
    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);

    // Redirect back to the listing
    req.flash("success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
}