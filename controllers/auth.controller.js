const User = require("../models/user.model");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerifyEmail } = require("../utils/sendMail");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const existsPending = await PendingUser.findOne({ email });
    if (existsPending) {
      return res.status(400).json({
        message: "Email đã đăng ký, vui lòng kiểm tra email để xác nhận"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      verifyToken: token,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    const verifyLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    await sendVerifyEmail(email, verifyLink);

    res.status(201).json({
      message: "Vui lòng kiểm tra email để xác nhận tài khoản"
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Thông tin đăng nhập không hợp lệ"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Thông tin đăng nhập không hợp lệ"
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login success",
      token
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const pending = await PendingUser.findOne({
      verifyToken: token,
      expiresAt: { $gt: Date.now() }
    });

    if (!pending) {
      return res
        .status(400)
        .render("verifyfail.ejs", {
          message: "Link không hợp lệ hoặc đã hết hạn"
        });
    }

    await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      isVerified: true
    });

    await PendingUser.deleteOne({ _id: pending._id });

    res.render("verifysuccess.ejs");
  } catch (err) {
    next(err);
  }
};

const dashboardPage = (req, res) => {
  res.render("dashboard.ejs");
};

module.exports = {
  register,
  login,
  verifyEmail,
  dashboardPage
};
