export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { path } = req.query;
  const url = `https://api-football-v1.p.rapidapi.com/v3/${path || ""}`;

  const response = await fetch(url, {
    headers: {
      "x-rapidapi-key": "c80f9c9b92msh313d80456212fe7p1874b8jsn07db2ff9b67f",
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}
