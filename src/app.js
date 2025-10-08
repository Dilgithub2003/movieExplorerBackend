const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// ✅ Middleware
const allowedOrigins = [
  'http://localhost:5173', // 🧑‍💻 your local React dev server
  'https://movieexplorer-frontend.onrender.com' // 🌐 your deployed frontend URL (update this!)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// ✅ API routes (place BEFORE serving React build)
app.get('/', (req, res) => {
  res.send({ msg: 'Hello from backend API!' });
});
app.use('/api/users', require('./routes/users'));

// ✅ Serve React build (AFTER your routes)
app.use(express.static(path.join(__dirname, '../client/build')));
app.all(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(error => console.error('❌ Error connecting to DB:', error));

// ✅ Dynamic port for deployment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
