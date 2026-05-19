module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 환경변수 존재 확인
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Missing env: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });
  }

  const auth = req.headers.authorization;
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Missing env: ADMIN_PASSWORD' });
  }
  if (!auth || auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/admin/users?per_page=1000`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    const text = await response.text();
    if (!response.ok) {
      return res.status(500).json({ error: `Supabase ${response.status}: ${text}` });
    }

    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
