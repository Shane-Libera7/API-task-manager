const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('project routes', () => {
    let accessToken;
    let refreshToken;
    let projectId;


// Authorization test as these routes are protected

beforeAll(async () => {
    //Register test user
    
    await request(app).post('/auth/register').send({ email: 'test@test.com', password: 'password123' });
    const response = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'password123'});


        
    refreshToken = response.body.refreshToken;
    accessToken = response.body.accessToken;

   
})

//Create Project

it('should create a new project for user', async () => {
    const response = await request(app).post('/projects').set('Authorization', `Bearer ${accessToken}`).send({name: 'Project 1'});

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');

    projectId = response.body.id;

});

// Get Projects

it('should return all projects created by user', async () => {
    const response = await request(app).get('/projects').set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.some(p => p.id === projectId)).toBe(true);

})



})