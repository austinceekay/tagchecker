app.get('/check', async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).json({ error: 'Missing URL param' });

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const html = response.data.toLowerCase();

    const hasGTM = html.includes('googletagmanager.com') || html.includes('gtm.js');
    const hasDirectGA = html.includes('google-analytics.com') || html.includes('gtag(') || html.includes('ua-') || html.includes('g-');

    // Adjusted: If GTM is present AND GA script is not directly found,
    // we now assume GA might be injected by GTM
    const gaDetected = hasDirectGA || (hasGTM && html.includes('ua-'));

    res.json({
      url,
      googleTagManager: hasGTM,
      googleAnalytics: gaDetected
    });
  } catch (err) {
    res.status(500).json({
      error: 'Unable to fetch or analyze the page',
      details: err.message
    });
  }
});
