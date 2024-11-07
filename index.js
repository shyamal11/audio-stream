const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());

const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI);

let db; // MongoDB database instance

// Connect to MongoDB when the server starts
async function initializeDatabase() {
  try {
    await client.connect();
    db = client.db('podcast-as-a-service'); // Use the correct database
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit if connection fails
  }
}

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Hello from audio-stream service');
});

// Endpoint to fetch a specific episode and return its mp3_file by episode_id
app.get('/episode/:id', async (req, res) => {
  try {
    // Ensure MongoDB is connected
    if (!db) await initializeDatabase();

    // Get the episode_id from the request parameters
    const episodeId = req.params.id;

    // Access the 'episode_library' collection
    const collection = db.collection('episode_library');

    // Find the specific episode using episode_id
    const episode = await collection.findOne({ episode_id: episodeId });

    if (!episode || !episode.mp3_file) {
      return res.status(404).send('Episode not found or no audio file available');
    }

    // Set headers for audio and send binary data as response
    res.set({
      'Content-Type': 'audio/mpeg', // Set correct MIME type for audio
      'Content-Length': episode.mp3_file.buffer.length, // Set content length
    });

    // Send the mp3_file as the response (binary data)
    res.send(episode.mp3_file.buffer);
  } catch (error) {
    console.error('Error fetching episode by ID:', error);
    res.status(500).send('Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing or additional use
module.exports = app;
