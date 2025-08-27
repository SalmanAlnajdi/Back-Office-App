const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Simple, reliable email regex (not too strict, not too loose)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// Password: at least 8 chars, 1 lowercase, 1 uppercase, 1 number, 1 special
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: (v) => PASSWORD_REGEX.test(v),
        message:
          "Password must include upper, lower, number, and special character",
      },
    },

    role: { type: String, default: "admin", enum: ["admin", "superAdmin"] },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    loginIP: { type: String },
  },
  { timestamps: true }
);

// Ensure the unique index exists (run once or keep it here)
adminSchema.index({ email: 1 }, { unique: true });

/**
 * Hash password before save if modified
 */
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Instance method to compare a plain password with the stored hash
 */
adminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
