const express = require('express');
const router = express.Router();
const db = require('../../db');
const authMiddleware = require('../../middleware/auth');


//Declare Middleware
router.use(authMiddleware);

// Create Project Route

router.post('/', async (req, res) => {
    const { projectName } = req.body;

    try {
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

    





    //Delete Project




module.exports = router;