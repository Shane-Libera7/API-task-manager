const express = require('express');
const router = express.Router();
const db = require('../../db');
const authMiddleware = require('../../middleware/auth');
const { createProjectSchema, patchProjectSchema } = require('../../schemas/projects');
const tasksRouter = require('./tasks/index');



//Declare Middleware
router.use(authMiddleware);

// Create Project Route



//Swagger
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Something went wrong
 */



router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        //Input Validation 
        const inputValidation = createProjectSchema.safeParse(req.body);
        if (inputValidation.success === false){
            return res.status(400).json(inputValidation.error);
        }
        const project = {
        user_id: req.userId,
        name: name
        };

        const [newProject] = await db('projects').insert(project).returning(['id', 'name', 'created_at']);
        return res.status(201).json(newProject);

    } catch(e){
        console.log(e);
        next(e);
    }

})

//Get all projects of user

//Swagger
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Something went wrong
 */






router.get('/', async (req, res) => {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    try {
        const projects = await db('projects').select(['id', 'name', 'created_at']).where('user_id', userId).limit(limit).offset((page - 1) * limit);
        return res.status(200).json(projects);
    } catch(e){
        console.log(e);
        next(e);
    }

})


    //Get a singular project

    //Swagger
    /**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a single project by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Something went wrong
 */







    router.get('/:id', async (req, res) =>{
        const userId = req.userId;
        const projectId = req.params.id;

        try{
            const project = await db('projects').select(['id', 'name', 'created_at']).where({ id: projectId, user_id: userId }).first();

            if(!project){
                return res.status(404).json({ error: 'Project not found'});
            }

            
            return res.status(200).json(project);


        } catch(e){
            console.log(e);
            next(e);

        }
    })



    //Update Project Name
    router.patch('/:id', async (req, res) => {
        const projectId = req.params.id;
        const { name } = req.body;
        const userId = req.userId;

        try{
            //Input Validation
            const inputValidation = patchProjectSchema.safeParse(req.body);
            if (inputValidation.success === false){
                return res.status(400).json(inputValidation.error);
            }

            
            const updatedProject = await db('projects').where({ id: projectId, user_id: userId }).update({ name: name}).returning(['id', 'name', 'created_at']);
            if (!updatedProject.length){
                return res.status(404).json({ error: 'Project not found'});
            }
            return res.status(200).json(updatedProject);


        } catch(e){
            console.log(e);
            next(e);
        }
    })
    





    //Delete Project

    router.delete('/:id', async (req, res) => {
        const projectId = req.params.id;
        const userId = req.userId;

        try{

            const project = await db('projects').where({ id: projectId, user_id: userId}).first();

            if (project){
                await db('tasks').where('project_id', projectId).delete();
                await db('projects').where({ id: projectId, user_id: userId}).delete();
        
                return res.status(204).send();
            } else{
                return res.status(404).json({ error: 'Project not found'});
            }
        } catch(e){
            console.log(e);
            next(e);
        }
    })



router.use('/:projectId/tasks', tasksRouter);

module.exports = router;