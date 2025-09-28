const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory array to store the submitted data
const records = [];

// 1. POST /api/record - Submit new data
app.post('/api/record', (req, res) => {
    const newRecord = {
        id: Date.now(), // Simple unique ID
        ...req.body
    };
    records.push(newRecord);
    console.log('New record submitted:', newRecord);
    res.status(201).send({ message: 'Record added successfully', record: newRecord });
});

// 2. GET /api/records - Retrieve all data
app.get('/api/records', (req, res) => {
    res.status(200).send(records);
});

// 3. GET /api/options - Retrieve dropdown options (static for simplicity)
app.get('/api/options', (req, res) => {
    const options = {
       
    };
    res.status(200).send(options);
});

app.listen(port, () => {
    console.log(`Node.js API listening at http://localhost:${port}`);
});