import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Needed to use __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Stories file path
const storiesFile = path.join(__dirname, 'stories.json');

// Load stories from file
function loadStories() {
  if (!fs.existsSync(storiesFile)) return [];
  const data = fs.readFileSync(storiesFile, 'utf-8');
  return JSON.parse(data);
}

// Save stories to file
function saveStories(stories) {
  fs.writeFileSync(storiesFile, JSON.stringify(stories, null, 2));
}

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to HearAStory API!');
});

// Get stories by type and language
app.get('/api/stories', (req, res) => {
  const { type, language } = req.query;

  if (!type || !language) {
    return res.status(400).json({ message: 'Type and language are required' });
  }

  const stories = loadStories();
  const filtered = stories.filter(
    s => s.type === type && s.language === language
  );

  if (filtered.length === 0) {
    return res.status(404).json({
      message: `No stories found for type "${type}" in language "${language}"`
    });
  }

  res.json(filtered);
});

// Add a new story
app.post('/api/stories', (req, res) => {
  const { id, type, language, title, content } = req.body;

  if (!id || !type || !language || !title || !content) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const stories = loadStories();
  if (stories.some(s => s.id === id)) {
    return res.status(409).json({ message: 'Story with this ID already exists' });
  }

  stories.push({ id, type, language, title, content });
  saveStories(stories);

  res.status(201).json({ message: 'Story added successfully' });
});

// Delete a story by ID
app.delete('/api/stories/:id', (req, res) => {
  const storyId = req.params.id;
  const stories = loadStories();
  const updatedStories = stories.filter(story => story.id !== storyId);

  if (stories.length === updatedStories.length) {
    return res.status(404).json({ message: 'Story not found' });
  }

  saveStories(updatedStories);
  res.json({ message: 'Story deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
