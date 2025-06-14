if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const Listing = require("./models/listing.js");
const express = require("express");
const app = express();
const port = 8080; 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/users.js");
// mongoDb setup :----------------------------------------------------------------------------------------------------
const mongoose = require("mongoose");
// const MONGO_url = "mongodb://127.0.0.1:27017/crush1";
const Db_url = process.env.ATLASDB_URL

main()
  .then((res) => {
    console.log("connection is successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(Db_url);
}
// ---------------------------------------------------------------------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

 const store = MongoStore.create({
  mongoUrl:Db_url,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err)
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

app.get("/location",async(req,res)=>{
  // let {location} = req.query;
  // console.log(location)

  // const listing =  await Listing.find({ location:`${location}` });
  // console.log(listing)
  let { location } = req.query;
  console.log(location);
  const listings = await Listing.find({ location: `${location}` })
// console.log(listings);
      // const title = listings[0].title;
      // const price = listings[0].price;
      // // Do something with this data
      // console.log(`Title: ${title}, Price: ${price}`);
  res.render("listings/search.ejs",{listings})
})


// ------------------------------------------------------------------------------------------------------------------

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});
app.use((err, req, res, next) => {
  let { statuscode = 505, message = "something want wrong" } = err;
  res.status(statuscode).render("listings/error.ejs", { message });
});
app.listen(port, () => {
  console.log("app was listenning");
});
