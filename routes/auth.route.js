const express = require("express");
const router = express.Router();
const { register, login, verifyEmail } = require("../controllers/auth.controller");
const validateRegister = require("../middlewares/validateRegister");

router.post("/register", validateRegister, register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);

module.exports = router;