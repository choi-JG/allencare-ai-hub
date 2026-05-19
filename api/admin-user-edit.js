module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId, name, department, employee_no } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    // 현재 user_metadata 조회 후 병합 (approved 등 기존 값 유지)
    const getRes = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/admin/users/${userId}`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );
    if (!getRes.ok) {
      const err = await getRes.text();
      return res.status(500).json({ error: err });
    }
    const user = await getRes.json();
    const existingMeta = user.user_metadata || {};

    const updatedMeta = {
      ...existingMeta,
      ...(name        !== undefined && { name }),
      ...(department  !== undefined && { department }),
      ...(employee_no !== undefined && { employee_no }),
    };

    const putRes = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/admin/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_metadata: updatedMeta }),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.text();
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
