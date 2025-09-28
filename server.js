const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin'); // 1. Import Firebase Admin SDK

// 2. Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Ensure path is correct

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // 3. Get a reference to the Firestore database

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// The name of your Firestore collection
const COLLECTION_NAME = 'laborRecords'; 

// 1. POST /api/record - Submit new data to Firestore
app.post('/api/record', async (req, res) => {
    try {
        const newRecord = {
            timestamp: admin.firestore.FieldValue.serverTimestamp(), // Add server timestamp
            ...req.body
        };
        
        // Use .add() to automatically generate a document ID
        const docRef = await db.collection(COLLECTION_NAME).add(newRecord);

        const recordWithId = { id: docRef.id, ...newRecord };
        
        console.log('New record submitted with ID:', docRef.id);
        res.status(201).send({ message: 'Record added successfully', record: recordWithId });

    } catch (error) {
        console.error('Error submitting record to Firestore:', error);
        res.status(500).send({ message: 'Failed to submit record.' });
    }
});

// 2. GET /api/records - Retrieve all data from Firestore
app.get('/api/records', async (req, res) => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).get();
        
        const records = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).send(records);

    } catch (error) {
        console.error('Error retrieving records from Firestore:', error);
        res.status(500).send({ message: 'Failed to retrieve records.' });
    }
});

// 3. GET /api/options - Retrieve dropdown options (static or from Firestore)
app.get('/api/options', (req, res) => {
    // You can modify this to pull data from a 'options' collection in Firestore if needed
    const options = {
        // ... (your existing static options)
    };
    res.status(200).send(options);
});

app.listen(port, () => {
    console.log(`Node.js API listening at http://localhost:${port}`);
});