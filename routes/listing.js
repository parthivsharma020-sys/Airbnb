const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// index Routes
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
  }),
);

// NEW ROUTES
router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

// show routes

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  }),
);

// create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// EDIT ROUTES
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  }),
);

// update routes
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(req.body.listing);
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true },
    );
    res.redirect("/listings");
  }),
);

// DELETE REVIEW ROUTE

// delete routes
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let dele = await Listing.findByIdAndDelete(id);
    console.log(dele);
    res.redirect("/listings");
  }),
);

module.exports = router;
