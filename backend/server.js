const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const seedAdmin = require("./seedAdmin"); 

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const userRoutes = require("./routes/userRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected');
    await seedAdmin(); 
  })
  .catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
