module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type, date, league } = req.query;

  try {
    let url;
    
    if (type === 'day') {
      const d = date || new Date().toISOString().split('T')[0];
      url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${d}&s=Soccer`;
    } else if (type === 'league') {
      url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${league}`;
    } else if (type === 'live') {
      url = `https://www.thesportsdb.com/api/v1/json/3/eventslive.php?s=Soccer`;
    } else {
      return res.status(400).json({ error: 'Type requis: day, league ou live' });
    }

    const response = await fetch(url);
    const data = await response.json();
    
    return res.status(200).json({ 
      success: true, 
      data: data
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
