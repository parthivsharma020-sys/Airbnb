const express = require("express");
const router = express.Router({mergeParams:true});
// from app
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// REVIEWS ROUTES  -- post routes
router.post(
  "/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

router.delete(
  "/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview),
);

module.exports=router;