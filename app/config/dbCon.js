const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbcon = await mongoose.connect(process.env.MONGODB_URL);
    if (dbcon) {
      console.log("database connected successsfully");
    }
  } catch (error) {
    console.log("server error", error.message);
  }
};

module.exports = connectDB;
