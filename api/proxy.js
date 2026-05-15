module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, date, team, league } = req.query;

  try {
    let url;

    if (type === 'day') {
      const d = date || new Date().toISOString().split('T')[0];
      url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${d}&s=Soccer`;
    } else if (type === 'last') {
      // Last 5 matches of a team
      url = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team}`;
    } else if (type === 'h2h') {
      // H2H between two teams
      url = `https://www.thesportsdb.com/api/v1/json/3/eventsh2h.php?idHomeTeam=${team}&idAwayTeam=${league}`;
    } else if (type === 'search') {
      // Search team by name
      url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(team)}`;
    } else if (type === 'league') {
      url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${league}`;
    } else {
      return res.status(400).json({ error: 'Type invalide' });
    }

    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json({ success: true, data });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
