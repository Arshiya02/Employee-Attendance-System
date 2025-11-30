const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- SCHEMAS ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  department: { type: String, default: 'General' }, 
});
const User = mongoose.model('User', userSchema);

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: String, // YYYY-MM-DD (Local)
  checkInTime: Date,
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' }
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: String, startDate: String, endDate: String, reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
});
const Leave = mongoose.model('Leave', leaveSchema);

// --- HELPER: GET LOCAL DATE ---
// This ensures the date saved is YOUR current date, not UTC
const getLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split('T')[0];
};

// --- ROUTES ---

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email taken" });
    const user = new User({ name, email, password, role, department });
    await user.save();
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.json(user);
  else res.status(400).json({ message: 'Invalid credentials' });
});

// 3. CHECK IN (Fixed Time Logic)
app.post('/api/attendance/checkin', async (req, res) => {
  const { userId } = req.body;
  const date = getLocalDate(); // Use Local Date
  
  const existing = await Attendance.findOne({ userId, date });
  if (existing) return res.status(400).json({ message: 'Already checked in' });
  
  const now = new Date();
  // Late if after 9:30 AM
  const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
  
  const newRecord = new Attendance({ userId, date, checkInTime: now, status: isLate ? 'late' : 'present' });
  await newRecord.save();
  res.json(newRecord);
});

// 4. GET ALL USERS (New: For Total Workforce Count)
app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-password'); // Don't send passwords
  res.json(users);
});

// 5. GET ATTENDANCE (Manager)
app.get('/api/attendance/all', async (req, res) => {
  const all = await Attendance.find().populate('userId', 'name department email');
  res.json(all);
});

// 6. GET HISTORY (Employee)
app.get('/api/attendance/:userId', async (req, res) => {
  const history = await Attendance.find({ userId: req.params.userId }).sort({ date: -1 });
  res.json(history);
});

// LEAVES
app.post('/api/leaves', async (req, res) => { await new Leave(req.body).save(); res.json({msg:"Saved"}); });
app.get('/api/leaves', async (req, res) => {
  const filter = req.query.role === 'manager' ? {} : { userId: req.query.userId };
  const leaves = await Leave.find(filter).populate('userId', 'name department');
  res.json(leaves);
});
app.put('/api/leaves/:id', async (req, res) => { await Leave.findByIdAndUpdate(req.params.id, {status: req.body.status}); res.json({msg:"Updated"}); });

// CONNECT
mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ MongoDB Connected'));
app.listen(5000, () => console.log('✅ Server running on 5000'));