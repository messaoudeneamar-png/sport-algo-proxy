const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type, date, sport } = req.query;

  try {
    // Flashscore API endpoints
    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
      'Accept': 'application/json, text/plain, */*',
      'Referer': 'https://www.flashscore.com/',
      'x-fsign': 'SW9D1eZo',
    };

    if (type === 'scores') {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const url = `https://d.flashscore.com/x/feed/f_1_${targetDate.replace(/-/g,'')}_1_en_1`;
      
      const response = await fetch(url, { headers });
      const text = await response.text();
      
      return res.status(200).json({ 
        success: true, 
        data: text,
        date: targetDate
      });
    }

    if (type === 'live') {
      const url = `https://d.flashscore.com/x/feed/live_1_en`;
      const response = await fetch(url, { headers });
      const text = await response.text();
      
      return res.status(200).json({ 
        success: true, 
        data: text 
      });
    }

    return res.status(400).json({ error: 'Type requis: scores ou live' });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message 
    });
  }
};
