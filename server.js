const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Replace with your actual OpenAI API key
const OPENAI_API_KEY = 'AIzaSyC49z_LTN61oe8CqcJTHgUbsvRKpZHT5d8';

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/finalDB';

// MongoDB schema and model
const chatSchema = new mongoose.Schema({
    userMessage: String,
    botMessage: String,
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/message', async (req, res) => {
    const userMessage = req.body.message;
    console.log('User message:', userMessage);

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/gpt-4/completions', {
            prompt: userMessage,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        const botMessage = response.data.choices[0].text.trim();
        console.log('API response:', botMessage);

        // Save the chat to MongoDB
        const chat = new Chat({ userMessage, botMessage });
        await chat.save();

        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        res.json({ message: "Sorry, there was an error processing your request." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});








 
