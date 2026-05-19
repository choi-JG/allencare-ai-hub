module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    if (!response.ok) {
      return res.status(500).json({ total: 0, approved: 0 });
    }

    const data = await response.json();
    const users = data.users || [];
    const approved = users.filter(u => u.user_metadata?.approved === true).length;

    return res.status(200).json({ total: users.length, approved });
  } catch (err) {
    return res.status(500).json({ total: 0, approved: 0 });
  }
};
