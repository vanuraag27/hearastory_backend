const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = './stories.json';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Load or initialize story database
let storyDatabase = {
  adventure: { en: [] },
  funny: { en: [] },
  mystery: { en: [] },
  fantasy: { en: [] },
  horror: { en: [] },
  motivational: { en: [] },
  moral: { en: [] }
};

if (fs.existsSync(path)) {
  try {
    const data = fs.readFileSync(path, 'utf-8');
    storyDatabase = JSON.parse(data);
  } catch (err) {
    console.error('Failed to load stories.json:', err.message);
  }
}

// Helper: Save current state to stories.json
function saveStories() {
  fs.writeFileSync(path, JSON.stringify(storyDatabase, null, 2), 'utf-8');
}

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

  const exists = storyDatabase[type][language].some(s => s.title === title);
  if (exists) {
    return res.status(409).json({ message: 'Story with this title already exists' });
  }

  const newStory = { title, content };
  storyDatabase[type][language].push(newStory);
  saveStories();

  res.status(201).json({ message: 'Story added successfully', story: newStory });
});

// DELETE a story
app.delete('/api/stories', (req, res) => {
  const { type, language = 'en', title } = req.body;

  if (!type || !title) {
    return res.status(400).json({ message: 'Type and title are required to delete a story' });
  }

  const stories = storyDatabase[type]?.[language];
  if (!stories) {
    return res.status(404).json({ message: 'Story list not found' });
  }

  const index = stories.findIndex(story => story.title === title);
  if (index === -1) {
    return res.status(404).json({ message: 'Story not found' });
  }

  stories.splice(index, 1);
  saveStories();

  res.json({ message: 'Story deleted successfully' });
});

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to HearAStory API!');
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
