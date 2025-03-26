const request = require('supertest');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { validateBugInput } = require('./helpers');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const bugs = [];

// API route to report a new bug
app.post('/api/bugs', (req, res) => {
    const { title, description, status = 'Open' } = req.body;
    const validation = validateBugInput(title, description);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }
    const newBug = { id: bugs.length + 1, title, description, status };
    bugs.push(newBug);
    res.status(201).json(newBug);
});

// API route to get all bugs
app.get('/api/bugs', (req, res) => {
    res.json(bugs);
});

// API route to delete a bug
app.delete('/api/bugs/:id', (req, res) => {
    const { id } = req.params;
    const index = bugs.findIndex(bug => bug.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ error: 'Bug not found' });
    }
    bugs.splice(index, 1);
    res.status(204).send();
});

// API route to update a bug
app.put('/api/bugs/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const index = bugs.findIndex(bug => bug.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ error: 'Bug not found' });
    }
    const validation = validateBugInput(title, description);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }
    bugs[index] = { id: parseInt(id), title, description, status };
    res.json(bugs[index]);
});

// Integration tests
describe('API Integration Tests', () => {
    it('should create a new bug', async () => {
        const response = await request(app)
            .post('/api/bugs')
            .send({ title: 'Test Bug', description: 'This is a test bug.' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Bug');
    });

    it('should retrieve all bugs', async () => {
        const response = await request(app).get('/api/bugs');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should update a bug', async () => {
        const createResponse = await request(app)
            .post('/api/bugs')
            .send({ title: 'Update Bug', description: 'This is a bug to update.' });
        const bugId = createResponse.body.id;

        const updateResponse = await request(app)
            .put(`/api/bugs/${bugId}`)
            .send({ title: 'Updated Bug', description: 'This bug has been updated.' });
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.title).toBe('Updated Bug');
    });

    it('should delete a bug', async () => {
        const createResponse = await request(app)
            .post('/api/bugs')
            .send({ title: 'Delete Bug', description: 'This bug will be deleted.' });
        const bugId = createResponse.body.id;

        const deleteResponse = await request(app).delete(`/api/bugs/${bugId}`);
        expect(deleteResponse.status).toBe(204);
    });
});
