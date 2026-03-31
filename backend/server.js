const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const seedAdmin = require("./seedAdmin"); 
const dynamicRoutes = require("./routes/dynamic");
const authRoutes = require('./routes/auth'); 
const userRoutes = require("./routes/userRoutes");
const auditRoutes = require("./routes/audit"); 


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/audit", require("./routes/audit"));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/dynamic", dynamicRoutes);
app.use("/api/audit-logs", auditRoutes);

// Connect to MongoDB
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
