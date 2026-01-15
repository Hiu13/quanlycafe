const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerifyEmail } = require("../utils/sendMail");

const register = async (req, res, next) => {
  try {
    const { name, email, password} = req.body;
    
    const exists = await User.findOne({ email});
    if(exists){
      return res.status(400).json({message: "Email đã tồn tại"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerifyToken: emailToken,
      isVerified: false
    });

    const verifyLink = `http://localhost:3000/api/auth/verify-email?token=${emailToken}`;

    await sendVerifyEmail(email, verifyLink);

    res.status(201).json({
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch(err){
    next(err);
  }
};

const login = async (req, res, next) => {
  try{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "Thông tin đăng nhập không hợp lệ"});
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Vui lòng xác thực email trước khi đăng nhập"
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ" });
    }

    const token = jwt.sign(
      {userId: user._id, role: user.role},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    res.json({
      message:"Login success",
      token
    });
  }catch(err){
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try{
  const { token } = req.query;

  const user = await User.findOne({ emailVerifyToken: token });
  if (!user) {
    return res.status(400).send({ message: "Link không hợp lệ hoặc đã hết hạn" });
  }
  user.isVerified = true;
  user.emailVerifyToken = undefined;
  await user.save();

  res.render("verify-success.ejs");
  }catch(err){
    next(err);
  }
};

let dashboardPage = (req, res) => {
  return res.render("dashboard.ejs");
};

module.exports = {register, login, verifyEmail, dashboardPage};