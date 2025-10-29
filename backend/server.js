// Main controller
const express = require('express');
const connectDB = require('./configs/db');
const farmerRoutes = require('./routes/farmerRoute');
const agronomistRoutes = require('./routes/agronomist');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authentication');


const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/',authRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



