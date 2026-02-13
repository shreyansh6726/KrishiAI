const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'KrishiAI' // Ensures it connects to the correct database within your cluster
})
.then(() => console.log("KrishiAI connected to MongoDB successfully"))
.catch(err => {
  console.error("Database connection error details:");
  console.error("Message:", err.message);
  console.error("Code:", err.code);
});

const PORT = process.env.PORT || 5000; // Render will provide the PORT variable
app.listen(PORT, '0.0.0.0', () => {
  console.log(`KrishiAI Server is live on port ${PORT}`);
});