const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Expense Tracker API is running!',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      income: '/api/income',
      expense: '/api/expense',
      dashboard: '/api/dashboard'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/income', require('./routes/income'));
app.use('/api/expense', require('./routes/expense'));
app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});