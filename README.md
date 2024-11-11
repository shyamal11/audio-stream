# Audio Stream Service

This is an Express-based Node.js application that connects to a MongoDB database to retrieve and stream audio episodes by `episode_id`. The application is designed to serve audio content for a React platform, providing endpoints to fetch audio files.

## Features
- Connects to a MongoDB database to retrieve episode data.
- Serves audio files (in MP3 format) from the database through a REST API.
- Provides a testing root endpoint to verify server connectivity.

## Prerequisites
- **Node.js**: Version 14 or above
- **MongoDB**: Ensure access to a MongoDB instance
- **Environment Variables**:
  - `MONGODB_URI`: MongoDB connection URI
  - `PORT`: (optional) Port on which the server will run (default is `3001`)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>

2. **Start the Server**:
    ```bash
    node index.js


