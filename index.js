const express = require('express');
const cors = require('cors');
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());


const client = new MongoClient(process.env.MONGODB_URI)

let gfs;

async function initializeDatabase() {
    if (!gfs) {
        console.log('Initializing GridFSBucket...');
        try {
            await client.connect();
            const database = client.db('podcast-as-a-service');
            gfs = new GridFSBucket(database, { bucketName: 'fs' });
            console.log('GridFSBucket initialized');
        } catch (error) {
            console.error('Error initializing GridFSBucket:', error);
            throw new Error('Failed to initialize GridFSBucket');
        }
    }
}

app.get('/', (req, res) => {
    res.send('Hello from audio-stream service');
});

// Audio Streaming Endpoint
app.get('/audio/:id', async (req, res) => {
    try {
        await initializeDatabase(); // Ensure the database is initialized

        const audioId = new ObjectId(req.params.id);
        console.log(`Received request for audio file with ID: ${audioId}`);

        const readstream = gfs.openDownloadStream(audioId);
        readstream.on('error', (err) => {
            console.error('Error while streaming audio file:', err);
            return res.status(404).json({ error: 'No file exists' });
        });

        readstream.pipe(res); // Stream the audio file to the response
        readstream.on('finish', () => {
            console.log('Audio streaming finished');
            // Optional: Close the client connection if using a serverless environment.
            // await client.close(); // Uncomment this if needed, but typically you won't in serverless
        });
    } catch (error) {
        console.error('Error handling audio request:', error);
        res.status(500).json({ error: 'Internal server error: Failed to initialize GridFS or process request' });
    }
});


if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001; // Default port for local development
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}
// Export the Express app
module.exports = app;
