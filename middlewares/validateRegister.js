const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Tên là bắt buộc")
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/).withMessage("Tên của bạn không được chứa số hoặc ký tự đặc biệt"),

  body("email")
  .trim()
  .notEmpty().withMessage("Email không được để trống")
  .isEmail().withMessage("Email không đúng định dạng")
  .custom(value => {
    if (!value.endsWith("@gmail.com")) {
      throw new Error("Chỉ chấp nhận email có dạng (@gmail.com)");
    }
    return true;
  }),

  body("password")
  .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 ký tự"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = validateRegister;
