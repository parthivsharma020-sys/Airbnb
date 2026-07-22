const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
// const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");

// index Routes

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
  }),
);

// NEW ROUTES

router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

// show routes

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "list does not exists");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
  }),
);

// create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
  }),
);

// EDIT ROUTES
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "list does not exists");
      return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  }),
);

// update routes
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(req.body.listing);
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true },
    );
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }),
);

// DELETE REVIEW ROUTE

// delete routes
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let dele = await Listing.findByIdAndDelete(id);
    console.log(dele);
    req.flash("success", "item deleted");
    res.redirect("/listings");
  }),
);

module.exports = router;
