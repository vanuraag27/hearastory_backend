const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json

// In-memory story database
const stories = require('./stories.json');
const storyDatabase = {
  adventure: { en: [] },
  funny: { en: [] },
  mystery: { en: [] },
  fantasy: { en: [] },
  horror: { en: [] },
  motivational: { en: [] },
  moral: { en: [] }
};

// GET stories
app.get('/api/stories', (req, res) => {
  const { type, language } = req.query;

  if (!type || !language) {
    return res.status(400).json({ message: 'Type and language are required' });
  }

  const stories = storyDatabase[type]?.[language] || [];
  if (stories.length === 0) {
    return res.status(404).json({ message: `No stories found for type "${type}" in language "${language}"` });
  }

  res.json(stories);
});

// POST to add a new story
app.post('/api/stories', (req, res) => {
  const { type, language = 'en', title, content } = req.body;

  if (!type || !title || !content) {
    return res.status(400).json({ message: 'Type, title, and content are required' });
  }

  if (!storyDatabase[type]) {
    storyDatabase[type] = {};
  }

  if (!storyDatabase[type][language]) {
    storyDatabase[type][language] = [];
  }

  storyDatabase[type][language].push({ title, content });

  res.status(201).json({ message: 'Story added successfully', story: { title, content } });
});

app.get('/', (req, res) => {
  res.send('Welcome to HearAStory API!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
