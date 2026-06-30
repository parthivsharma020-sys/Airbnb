const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then((res) => {
    console.log("coneected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("<h1>hello parthiv</h1>");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

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

// index Routes

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
  }),
);

// NEW ROUTES
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

// show routes

app.get(
  "/listings/:id",
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
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// EDIT ROUTES
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  }),
);

// update routes
app.put(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let dele = await Listing.findByIdAndDelete(id);
    console.log(dele);
    res.redirect("/listings");
  }),
);

// REVIEWS ROUTES  -- post routes
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    await newReview.save();
    listing.reviews.push(newReview);

    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  }),
);

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

app.all("/{*path}", (req, res, next) => {
  next(new ExpressError(404, "page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message);
});

app.listen(8000, () => {
  console.log("server is on 8000");
});

// app.get("/testListing",async(req, res) => {
//   let sampleListing=new Listing({
//     title:"myhome",
//     description:"tine tone yuo",
//     price :12300,
//     location:"navi mumbai",
//     country:"INDIA",

//   });
//   await sampleListing.save();
//   console.log("successfull test");
//   res.send("success full test");
// });
