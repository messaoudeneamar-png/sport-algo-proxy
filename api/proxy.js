module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, date, team, team2, league } = req.query;

  try {
    let url;

    if (type === 'day') {
      const d = date || new Date().toISOString().split('T')[0];
      url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${d}&s=Soccer`;
    } else if (type === 'last') {
      url = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team}`;
    } else if (type === 'h2h') {
      url = `https://www.thesportsdb.com/api/v1/json/3/eventsh2h.php?idHomeTeam=${team}&idAwayTeam=${team2}`;
    } else if (type === 'search') {
      url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(team)}`;
    } else if (type === 'league') {
      url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${league}`;
    } else if (type === 'multi') {
      // Search multiple teams at once
      const teams = team.split(',');
      const results = {};
      for (const t of teams) {
        try {
          const r = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(t.trim())}`);
          const d = await r.json();
          if (d.teams && d.teams[0]) {
            results[t.trim()] = {
              id: d.teams[0].idTeam,
              name: d.teams[0].strTeam
            };
          }
        } catch(e) {}
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
      }
      return res.status(200).json({ success: true, data: results });
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
