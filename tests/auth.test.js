const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

//Tests
describe('auth routes', () => {
    let refreshToken;
    let accessToken;


    //Delete user before registering 

    beforeAll(async () => {
        const user = await db('users').where('email', 'test@test.com').first();
        if (user){
            const projects = await db('projects').where('user_id', user.id).select('id');
            const projectIds = projects.map(p => p.id);
            await db('tasks').whereIn('project_id', projectIds).delete();
            await db('refresh_tokens').where('user_id', user.id).delete();
            await db('projects').where('user_id', user.id).delete();
            await db('users').where('id', user.id).delete();
        }
    });


    //Register
    it('should register a new user', async () => {
        const response = await request(app).post('/auth/register').send({ email: 'test@test.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    //Login
    it('log a user in', async () => {
        const response = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'password123'});

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body).toHaveProperty('accessToken');

        refreshToken = response.body.refreshToken;
        accessToken = response.body.accessToken;

    });


    //Refresh Token
    it('should refresh the token of a user logged in', async () => {
        const response = await request(app).post('/auth/refresh').send({ refreshToken });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
    });


    //Logout
    it('should log a user out', async () => {
        const response = await request(app).post('/auth/logout').send({ refreshToken });
        expect(response.status).toBe(204);

        //Make sure Refresh Token is deleted
        const test = await request(app).post('/auth/refresh').send({ refreshToken });
        expect(test.status).toBe(400);
    });



    afterAll(async () => {
        const user = await db('users').where('email', 'test@test.com').first();
    if (user) {
        await db('refresh_tokens').where('user_id', user.id).delete();
        await db('projects').where('user_id', user.id).delete();
        await db('users').where('id', user.id).delete();
    }
    });


    
});


