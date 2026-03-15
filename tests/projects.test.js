const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('project routes', () => {
    let refreshToken;
    let accessToken;
    let projectId;
    let secondRefreshToken;
    let secondAccessToken;
    //Register user to get Tokens

    
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

        const response = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'password123' });

        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;




    });

    //Create Project
    it('should create a project for user', async () => {
        
        const response = await request(app).post('/projects').send({ name: 'project'}).set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');

        projectId = response.body.id;
    })



    //Get projects
    it('should get projects of user', async () => {
        const response = await request(app).get('/projects').set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some(p => p.id === projectId)).toBe(true);

    })



    //Forbid access to other users projects 
    
    
    it('should stop a user from accessing projects of another user', async () => {
        //Create & log in to 2nd user
        await request(app).post('/auth/register').send({ email: 'test22@test.com', password: 'password12367' });

        const resp = await request(app).post('/auth/login').send({ email: 'test22@test.com', password: 'password12367' });

        secondAccessToken = resp.body.accessToken;
        secondRefreshToken = resp.body.refreshToken;


        // Attemp to access User 1's Account 

        const response = await request(app).get(`/projects/${projectId}`).set('Authorization', `Bearer ${secondAccessToken}`);
        expect(response.status).toBe(404);


        //Clean up database 
        const user2 = await db('users').where('email', 'test22@test.com').first();
        await db('refresh_tokens').where('user_id', user2.id).delete();
        await db('users').where('id', user2.id).delete();



    })
















})