module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, author_name, department, content } = req.body;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: process.env.ADMIN_EMAIL,
        subject: `[AllenCare AI Hub] 새 사례 공유: ${title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <div style="background: #2552B5; padding: 24px 28px; border-radius: 10px 10px 0 0;">
              <h2 style="color: #fff; margin: 0; font-size: 1.1rem;">AllenCare AI Hub — 새 사례 등록</h2>
            </div>
            <div style="background: #f8fafc; padding: 24px 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 80px; vertical-align: top;">제목</td>
                  <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; vertical-align: top;">작성자</td>
                  <td style="padding: 8px 0; color: #334155;">${author_name}${department ? ' · ' + department : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; vertical-align: top;">내용</td>
                  <td style="padding: 8px 0; color: #334155; line-height: 1.6;">${content}</td>
                </tr>
              </table>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: errText });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
