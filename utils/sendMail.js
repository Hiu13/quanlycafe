const transporter = require("../config/mail");

const sendVerifyEmail = async (toEmail, verifyLink) => {
  await transporter.sendMail({
    from: `"Coffee Management System" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Xác thực email đăng ký",
    html: `
      <h2>Hệ thống quản lý quán Coffee</h2>
      <p>Vui lòng click vào link bên dưới để xác thực tài khoản:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>Link có hiệu lực trong 15 phút</p>
    `
  });
};

module.exports = { sendVerifyEmail };
