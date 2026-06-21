const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    maxLength: 200,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default:"https://images.unsplash.com/photo-1777740718372-75b8d23d3cc0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === " "
        ? "https://images.unsplash.com/photo-1777740718372-75b8d23d3cc0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
  },
  price: {
    type: String,
    required: true,
  },
  location:{
    type:String,
    required:true,
  },
  country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
