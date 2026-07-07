export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse the incoming request body
  const { name, email, message, type = 'Contact Form' } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Build the email HTML dynamically based on the form type
  const htmlContent = `
    <h2>New Submission: ${type}</h2>
    ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
    <p><strong>Email:</strong> ${email}</p>
    ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}
  `;

  try {
    // Send email using Resend REST API securely from the backend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Efecto Agency <info@efectoagency.com>',
        to: 'dario@efectoagency.com',
        subject: `New ${type} Inquiry from ${name || email}`,
        html: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Resend API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
