const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

//  Middleware
// const allowedOrigins = [
//   'http://localhost:5173', // local dev
//   //'https://movie-explorer-frontend-fiq34lo4s-thilinadilshans-projects.vercel.app'
//   'https://movie-explorer-frontend.vercel.app/'// Vercel frontend
// ];

const allowedOrigins = [
  'http://localhost:5173',
  'https://movie-explorer-frontend.vercel.app' // ✅ no trailing slash
];



app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server-to-server requests
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

//  API routes (place BEFORE serving React build)
app.get('/', (req, res) => {
  res.send({ msg: 'Hello from backend API!' });
});
app.use('/api/users', require('./routes/users'));

//  Serve React build (AFTER your routes)
app.use(express.static(path.join(__dirname, '../client/build')));
app.all(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


//  MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(error => console.error(' Error connecting to DB:', error));

// Dynamic port for deployment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
