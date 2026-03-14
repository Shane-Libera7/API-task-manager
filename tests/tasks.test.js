const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');


describe('task routes', () => {
let accessToken;
let refreshToken;
let projectId;
let taskId;


//Register and Login for tokens 
beforeAll(async () => {
    //Clear database 
        const user = await db('users').where('email', 'test@test.com').first();
        if (user){
            const projects = await db('projects').where('user_id', user.id).select('id');
        const projectIds = projects.map(p => p.id);
        await db('tasks').whereIn('project_id', projectIds).delete();
        await db('refresh_tokens').where('user_id', user.id).delete();
        await db('projects').where('user_id', user.id).delete();
        await db('users').where('id', user.id).delete();
        }
        //Register & Login 
        await request(app).post('/auth/register').send({ email: 'test@test.com', password: 'password123' });

        const resp = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'password123' });

        accessToken = resp.body.accessToken;
        refreshToken = resp.body.refreshToken;

        //Create Project for projectID
        const response = await request(app).post('/projects').send({ name: 'project'}).set('Authorization', `Bearer ${accessToken}`);

        projectId = response.body.id;
        console.log(projectId);



})

//Create Task

it('should create a task', async () => {
    const response = await request(app).post(`/projects/${projectId}/tasks`)
                            .set('Authorization', `Bearer ${accessToken}`)
                            .send({ title: 'task', description: 'task desc', priority: 'high', due_date: '2026-02-01', completed: false });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');

    taskId = response.body.id;






})


//Complete Task

it('should complete task', async () => {
    const response = await request(app).patch(`/projects/${projectId}/tasks/${taskId}/complete`).set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body[0].completed).toBe(true);
})













})