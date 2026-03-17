const express = require('express');
const authRoutes = require('./routes/auth/index');
const projectRoutes = require('./routes/projects/index');
const taskRoutes = require('./routes/projects/tasks/index');
const errorHandler = require('../src/middleware/errorHandler');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
require('dotenv').config();


//Accept Railway proxy
app.set('trust proxy', 1);

//Middleware
app.use(express.json());
app.use(helmet());

//Swagger

//Swagger-Jsdoc
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'A REST API for managing tasks and projects'
        }
    },
    apis: ['./src/routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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