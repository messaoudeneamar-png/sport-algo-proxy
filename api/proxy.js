export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { path } = req.query;
  const url = `https://v3.football.api-sports.io/${path || ""}`;

  const response = await fetch(url, {
    headers: { "x-apisports-key": "44339918ac06c7a0cb2ccfe16e6c6706" }
  });

  const data = await response.json();
  res.status(200).json(data);
}
