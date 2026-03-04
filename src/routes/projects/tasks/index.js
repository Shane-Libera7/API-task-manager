const express = require('express');
const db = require('../../../db');
const router = express.Router({ mergeParams: true });
const authMiddleware = require('../../../middleware/auth');


//Authentifcation and enforcement of Ownership
router.use(authMiddleware);

async function verifyProjectOwnership(projectId, userId){
    const project = await db('projects').where({ id: projectId, user_id: userId }).first();
    return project ? project: null;
}


//Create task Route 
router.post('/', async (req, res) => {

    const { title, description, priority, due_date, completed } = req.body;
    const projectId = req.params.projectId;
    const userId = req.userId;

    try{
        const valid = await verifyProjectOwnership(projectId, userId);
        if(!valid){
            return res.status(404).json({ error: 'Project is needed to assign task to it'});
        }


        const task = {
            project_id: projectId,
            title: title,
            description: description,
            priority: priority,
            due_date: due_date,
            completed: completed
        }

        const [newTask] = await db('tasks').insert(task).returning(['id', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at']);

        return res.status(201).json(newTask);

    } catch(e) {
        console.log(e);
        return res.status(500).json({ error: 'Something went wrong'});
    }
    
})





//Get all tasks 
router.get('/', async (req, res) => {
    const userId = req.userId;
    const projectId = req.params.projectId;
    try{
        const valid = await verifyProjectOwnership(projectId, userId);
        if(!valid){
            return res.status(404).json({ error: 'Project is needed to assign task to it'});
        }

        const tasks = db('tasks').select(['id', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at']).where('project_id', projectId);
        return res.status(200).json(tasks);



    }catch(e){
        console.log(e);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});




module.exports = router;