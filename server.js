const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// MongoDB connection URI and Database Name
const uri = 'mongodb://localhost:27017/';
const dbName = 'spri4';

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

async function main() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const messagesCollection = db.collection('messages');

        // Example endpoint to handle user messages
        app.post('/api/message', async (req, res) => {
            const userMessage = req.body.message;
            console.log('Received message:', userMessage);

            // Simulate a response from the Gemini API (Replace with actual API call)
            const botResponse = process.env.Gemini_API_KEY;
            console.log('Sending response:', botResponse);

            // Store the message and response in the database
            await messagesCollection.insertOne({
                userMessage: userMessage,
                botResponse: botResponse,
                timestamp: new Date()
            });

            res.json({ response: botResponse });
        });

        // Endpoint to fetch chat history
        app.get('/api/messages', async (req, res) => {
            try {
                const messages = await messagesCollection.find({}).toArray();
                res.json(messages);
            } catch (e) {
                console.error(e);
                res.status(500).send('Error fetching messages');
            }
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);








 
