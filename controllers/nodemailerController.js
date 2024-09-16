import nodemailer from 'nodemailer';

export const CreateMessage = async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Configure the transporter with your email service provider's settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'meghasajup05@gmail.com',
      pass: 'tsvb higt rlta kaan',
    },
  });

  const mailOptions = {
    from: 'meghasajup05@gmail.com',
    to: to,
    subject: subject,   
    text: text,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
