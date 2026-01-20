const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  verifyToken: {
    type: String,
    required: true
  },

  expiresAt: {
    type: Date,
    required: true,
    expires: 0
  }
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
