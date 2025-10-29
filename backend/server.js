// Main controller
const express = require('express');
const connectDB = require('./configs/db.js')
const farmerRoutes = require('./routes/farmerRoute');
const agronomistRoutes = require('./routes/agronomist');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authentication.js');
const rateLimit = require("express-rate-limit");



const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});


// Middleware
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    
    }
));

// Connect to Database and Start Server
connectDB();

app.use(express.json());


//  Getting the homepage
app.get('/', (req, res) => {
    res.send('Welcome to the Smart Farm API');
});


// Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/agronomists', agronomistRoutes);
app.use('/auth',authRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



