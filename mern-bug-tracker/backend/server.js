const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { validateBugInput } = require('./helpers'); // Import the helper function

const app = express(); 
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Bug Tracker API');
});

const bugs = [];

// API route to report a new bug
app.post('/api/bugs', (req, res) => {
    const { title, description, status = 'Open' } = req.body;

    // Validate required fields using the helper function
    const validation = validateBugInput(title, description);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    // Create a new bug object
    const newBug = {
        id: bugs.length + 1,
        title,
        description,
        status,
    };

    // Store the new bug in the array
    bugs.push(newBug);

    // Respond with the newly created bug
    res.status(201).json(newBug);
});

// API route to get all bugs
app.get('/api/bugs', (req, res) => {
    res.json(bugs);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
