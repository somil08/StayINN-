// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");


// const Db_url = process.env.ATLASDB_URL
// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(Db_url);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data = initData.data.map((obj)=>({...obj,owner:"66c766aba908e8657e0bd990"}))
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const Db_url ="mongodb+srv://somilRathore:794GzYGIIeGyBhx2@cluster0.xvbeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log(Db_url)

async function main() {
  await mongoose.connect(Db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to DB");
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "66c766aba908e8657e0bd990", // Add owner ID to each listing
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

main()
  .then(initDB)
  .catch((err) => {
    console.log("Connection error:", err);
  });
