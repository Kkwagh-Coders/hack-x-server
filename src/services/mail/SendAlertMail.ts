import sendMail from './sendMail';
const SendAlertMail = async (
  email: string[],
  message: string,
  username: string,
) => {
  const CLIENT_BASE_URL = process.env['CLIENT_BASE_URL'];
  if (!CLIENT_BASE_URL) {
    throw new Error('CLIENT_BASE_URL not Defined');
  }

  const verificationURL = `${CLIENT_BASE_URL}/dashboard/inventory`;
  const senderEmail = process.env['MAIL_USER'];
  const emailSubject = 'Inventory ALert';
  const emailTemplate = 'alert';
  const officialName = 'Hack - X';
  const context = { verificationURL, officialName, message, username };

  const mailOptions = {
    from: senderEmail,
    to: email,
    subject: emailSubject,
    template: emailTemplate,
    context: context,
  };

  return await sendMail(mailOptions);
};

export default SendAlertMail;
