const express = require('express');
const authRoutes = require('./routes/auth/index');
const app = express();
const port = 3000;


//Middleware
app.use(express.json());

//Start Server
app.listen(port);

//routes 
app.get('/health', (req,res) =>{
    res.status(200).json({ status: 'ok'});
});

//Authentication
app.use('/auth', authRoutes);




