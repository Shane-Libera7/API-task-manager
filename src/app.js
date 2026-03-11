const express = require('express');
const authRoutes = require('./routes/auth/index');
const projectRoutes = require('./routes/projects/index');
const taskRoutes = require('./routes/projects/tasks/index');
const errorHandler = require('../src/middleware/errorHandler');
const app = express();
require('dotenv').config();

//Middleware
app.use(express.json());


//routes 
app.get('/health', (req,res) =>{
    res.status(200).json({ status: 'ok'});
});

//Authentication
app.use('/auth', authRoutes);

//Project routes
app.use('/projects', projectRoutes);

//Task routes
app.use('/:projectId/tasks', taskRoutes);

//Error Handling
app.use(errorHandler);

module.exports = app;