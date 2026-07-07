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
const session=require("express-session");
const flash=require("connect-flash")

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const sessionOption = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
  }
};

app.use(session(sessionOption));
app.use(flash());

app.get("/", (req, res) => {
  res.send("<h1>hello, WELCOME BUDDY  -parthiv</h1>");
});

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

app.use("/listings", listings);
app.use("/listings/:id", reviews);

app.all("/{*path}", (req, res, next) => {
  next(new ExpressError(404, "page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8000, () => {
  console.log("server is on 8000");
});
