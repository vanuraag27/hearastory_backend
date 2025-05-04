const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Mock Story Database
const storyDatabase = {
  funny: {
    en: [
      { title: 'The Lost Laughter', content: 'Once upon a time in a silly village, everyone laughed all day long...' },
      { title: "The Jester's Joke", content: 'A jester once made a joke so funny that the king couldn\'t stop laughing...' },
      { 
        title: 'The Sweet Grandmother', 
        content: 'A sweet grandmother telephoned St. Josephs Hospital and timidly asked to check on a patient. When the operator requested the name and room number, she replied "Norma Findlay, Room 302." After checking with nurses, the operator reported excellent progress and discharge plans. Relieved, the grandmother thanked them, only for the operator to ask "Is Norma your daughter?" She cheerfully responded: "No - I\'m Norma Findlay in Room 302 and no one tells me anything!"' 
      }
    ]
  },
  adventure: {
    en: [
      { title: "The Great Journey", content: "In a faraway land, adventurers set out on an epic journey..." }
    ]
  },
  mystery: {
    en: [
      { title: "The Vanishing Key", content: "Detective Riley was stumped. The key had vanished from the locked drawer, leaving no trace. Everyone in the mansion was a suspect..." }
    ]
  },
  fantasy: {
    en: [
      { title: "The Dragon's Secret", content: "In the enchanted kingdom of Eldoria, a young mage discovered that the last dragon was hiding a magical secret capable of saving the realm..." }
    ]
  },
  horror: {
    en: [
      { title: "Whispers in the Walls", content: "Every night at midnight, Sarah heard whispers coming from the walls of her new home. One night, she decided to follow the voice..." }
    ]
  },
  motivational: {
    en: [
      { title: "The Runner Who Never Quit", content: "Despite finishing last in every race, Leo kept training. One day, his persistence inspired a whole town—and he finally crossed the finish line first." }
    ]
  },
  moral: {
    en: [
      { title: "The Honest Woodcutter", content: "When a woodcutter dropped his axe into a river, a spirit appeared offering him a golden one. He refused it, choosing honesty—and was rewarded greatly." }
    ]
  }
};

// API endpoint for stories
app.get('/api/stories', (req, res) => {
  const { type, language } = req.query;

  if (!type || !language) {
    return res.status(400).json({ message: 'Type and language are required' });
  }

  if (!storyDatabase[type] || !storyDatabase[type]['en']) {
    return res.status(404).json({ message: `No stories found for type "${type}"` });
  }

  // Always return English stories as base (frontend will handle translation)
  res.json(storyDatabase[type]['en']);
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to HearAStory API!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
