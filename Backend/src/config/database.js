const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const { MONGODB_URI } = process.env;
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.log("Error: " + err.message);
  }
};

module.exports = {
  connectDB,
};
