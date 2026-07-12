const express=require("express");

const mongoose = require("mongoose");
const initData = require("./data.js");
// const Listing = require("./models/listing.js");
const Listing = require("../models/listing.js");

// app.use("/init", express.static(path.join(__dirname, "init")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main()
  .then((res) => {
    console.log("coneected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was saved in DATABASE");
};
initDB();
