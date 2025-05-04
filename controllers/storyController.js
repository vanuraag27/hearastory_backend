const axios = require('axios');

// Controller for fetching stories based on user selection
exports.getStories = async (req, res) => {
    const { type, language } = req.query;

    // External API URL (example)
    const apiUrl = `https://api.example.com/stories?type=${type}&language=${language}`;

    try {
        // Fetch stories from the external API
        const response = await axios.get(apiUrl);
        res.json(response.data);  // Send the fetched stories to the frontend
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ message: 'Failed to fetch stories' });
    }
};
