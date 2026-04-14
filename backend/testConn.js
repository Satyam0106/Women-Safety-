const mongoose = require("mongoose");
require("dotenv").config();

async function test() {
  try {
    console.log("Testing connection to:", process.env.MONGO_URI.replace(/:([^@]+)@/, ":****@"));
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection successful!");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}
test();
