const express = require('express')
require('dotenv').config()
const cors = require('cors');

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Marshrutlar
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/queues', require('./routes/queueRoutes'));

app.listen(PORT, () => {
    console.log('Server ishlamoqda ' + PORT);
})
