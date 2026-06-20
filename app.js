const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");

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
app.use(express.static(path.join(__dirname,"/public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

app.get("/", (req, res) => {
  res.send("<h1>hello parthiv</h1>");
});

// index Routes

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
});

// NEW ROUTES
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

// show routes

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
});

// create route
app.post("/listings", async (req, res) => {
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// EDIT ROUTES
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
});

// update routes    
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  // console.log(req.body.listing);
  await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true },
  );
  res.redirect("/listings");
});

// delete routes
app.delete("/listings/:id",async (req,res)=>{
  let {id}=req.params;
 let dele=await Listing.findByIdAndDelete(id);
 console.log(dele); 
  res.redirect("/listings");
})

app.listen(8000, () => {
  console.log("server is on 8080");
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
