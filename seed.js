const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String
});
const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Seeding Database...');
  
  // Clear old users
  await User.deleteMany({});

  // Create Manager
  await User.create({
    name: "Boss Manager",
    email: "boss@test.com",
    password: "123",
    role: "manager"
  });

  // Create Employee
  await User.create({
    name: "John Employee",
    email: "john@test.com",
    password: "123",
    role: "employee"
  });

  console.log('✅ Data Seeded! Login with boss@test.com or john@test.com (password: 123)');
  process.exit();
});