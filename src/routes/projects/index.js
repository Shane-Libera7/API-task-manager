const express = require('express');
const router = express.Router();
const db = require('../../db');
const authMiddleware = require('../../middleware/auth');
const { createProjectSchema, patchProjectSchema } = require('../../schemas/projects');



//Declare Middleware
router.use(authMiddleware);

// Create Project Route

router.post('/', async (req, res) => {
    const { projectName } = req.body;

    try {
        //Input Validation 
        const inputValidation = createProjectSchema.safeParse(req.body);
        if (inputValidation.success === false){
            return res.status(400).json(inputValidation.error);
        }
        const project = {
        user_id: req.userId,
        name: projectName
        };

        const [newProject] = await db('projects').insert(project).returning(['id', 'name', 'created_at']);
        return res.status(201).json(newProject);

    } catch(e){
        console.log(e);
        return res.status(500).json({ error: 'Something went wrong'});
    }

})

//Get all projects of user
router.get('/', async (req, res) => {
    const userId = req.userId;
    try {
        const projects = await db('projects').select(['id', 'name', 'created_at']).where('user_id', userId);
        return res.status(200).json(projects);
    } catch(e){
        console.log(e);
        return res.status(500).json({ error: 'Something went wrong'});
    }

})


    //Get a singular project
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
            return res.status(500).json({ error: 'Something went wrong'});

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
            return res.status(500).json({ error: 'Something went wrong'});
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
            return res.status(500).json({ error: 'Something went wrong'});
        }
    })




module.exports = router;