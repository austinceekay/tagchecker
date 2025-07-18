const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/check', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing URL param' });

  try {
    const response = await axios.get(url, { timeout: 8000 });
    const html = response.data.toLowerCase();
    const hasGA = html.includes('google-analytics.com') || html.includes('gtag(');
    const hasGTM = html.includes('googletagmanager.com') || html.includes('gtm.js');

    res.json({ url, googleAnalytics: hasGA, googleTagManager: hasGTM });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch site', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Tag Detection API is running.');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
