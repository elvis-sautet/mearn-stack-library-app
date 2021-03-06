const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`Connected to mongoDb ${conn.connection.host} `);
  } catch (err) {
    console.log("Error:" + err);
    process.exit(1);
  }
};

module.exports = connectDB;
