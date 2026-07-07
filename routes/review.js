const express = require("express");
const router = express.Router({mergeParams:true});
// from app
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
  console.log(req.body);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// REVIEWS ROUTES  -- post routes
router.post(
  "/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    await newReview.save();
    listing.reviews.push(newReview);

    await listing.save();
    req.flash("success","New Review added");
    res.redirect(`/listings/${listing._id}`);
  }),
);

router.delete(
  "/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review  deleted");
    res.redirect(`/listings/${id}`);
  }),
);

module.exports=router;