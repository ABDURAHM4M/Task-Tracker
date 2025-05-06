// src/helpers/sendEmail.js
const sendEmail = async (
    subject,
    send_to,
    sent_from,
    reply_to,
    template,
    name,
    url
  ) => {
    console.log(`📧 Simulating email:
    ------------------------
    To: ${send_to}
    Subject: ${subject}
    Template: ${template}
    Name: ${name}
    URL: ${url}
    ------------------------
    (This is just a mock. No email was actually sent.)
    `);
  };
  
  export default sendEmail;
  