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

        const tasks = await db('tasks').select(['id', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at']).where('project_id', projectId);
        return res.status(200).json(tasks);



    }catch(e){
        console.log(e);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});



//Get a single Task

router.get('/:id', async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.userId;
    const taskId = req.params.id;

    try{
        const valid = await verifyProjectOwnership(projectId, userId);
        if(!valid){
            return res.status(404).json({ error: 'Project is needed to assign task to it'});
        }

        const task = await db('tasks').select(['id', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at']).where({ id: taskId, project_id: projectId}).first();

        if (!task){
            return res.status(404).json({ error: 'Task not found'});
        }

        return res.status(200).json(task);

    }catch(e){
        console.log(e);
        return res.status(500).json({ error:'Something went wrong'});
    }
})



//Update a task

router.patch('/:id', async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.userId;
    let update = {};
    const taskId = req.params.id;
    try{
        const valid = await verifyProjectOwnership(projectId, userId);
        if(!valid){
            return res.status(404).json({ error: 'Project is needed to assign task to it'});
        }

        if (req.body.title !== undefined){
            update.title = req.body.title;
        } if (req.body.description !== undefined){
            update.description = req.body.description;
        } if (req.body.priority !== undefined){
            update.priority = req.body.priority;
        } if (req.body.due_date !== undefined){
            update.due_date = req.body.due_date;
        } if (req.body.completed !== undefined){
            update.completed = req.body.completed;
        }
       

        if (Object.keys(update).length === 0){
            return res.status(400).json({ error: 'No fields entered to be updated'});
        }

        const updatedTask = await db('tasks').where({ id: taskId, project_id: projectId}).update(update).returning(['id', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at']);
        return res.status(200).json(updatedTask);




    }catch(e){
        console.log(e);
        res.status(500).json({ error: 'Something went wrong'});
    }

})




//




module.exports = router;