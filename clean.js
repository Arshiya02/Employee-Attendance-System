const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await mongoose.connection.collection('attendances').deleteMany({});
  console.log("Cleared old attendance data.");
  process.exit();
});