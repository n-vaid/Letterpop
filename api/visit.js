// Letterpop visitor counter — a tiny Vercel function.
// Adds 1 to a total stored in Upstash Redis and returns the new number.
// Vercel fills in these settings automatically when you connect an Upstash Redis database to the project.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  if (!URL_ || !TOKEN) return res.status(503).json({ error: 'Counter database not connected yet' });
  try {
    const r = await fetch(`${URL_.replace(/\/$/, '')}/incr/letterpop:visitors`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const data = await r.json();
    if (!r.ok || typeof data.result !== 'number') return res.status(502).json({ error: 'Counter unavailable' });
    return res.status(200).json({ visitor: data.result });
  } catch (e) {
    return res.status(502).json({ error: 'Counter unavailable' });
  }
};
