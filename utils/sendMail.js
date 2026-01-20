const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,      // gmail của hệ thống
    pass: process.env.MAIL_PASS       // app password
  }
});

const sendVerifyEmail = async (toEmail, verifyLink) => {
  await transporter.sendMail({
    from: `"Coffee System" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Xác nhận đăng ký tài khoản",
    html: `
      <p>Chào bạn,</p>
      <p>Vui lòng bấm vào link dưới đây để xác nhận tài khoản:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>Link có hiệu lực trong 15 phút.</p>
    `
  });
};

module.exports = { sendVerifyEmail };
