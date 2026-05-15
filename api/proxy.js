module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type, date } = req.query;

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      'Accept': '*/*',
      'Referer': 'https://www.flashscore.com/',
      'x-fsign': 'SW9D1eZo',
    };

    let url;
    if (type === 'live') {
      url = 'https://d.flashscore.com/x/feed/live_1_en';
    } else {
      const d = date || new Date().toISOString().split('T')[0].replace(/-/g,'');
      url = `https://d.flashscore.com/x/feed/f_1_${d}_1_en_1`;
    }

    const response = await fetch(url, { headers });
    const text = await response.text();
    
    return res.status(200).json({ 
      success: true, 
      data: text.substring(0, 5000)
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
