const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      maxlength: 255,
    },
    customerNumber: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{9}$/.test(v.toString());
        },
        message: (props) => `${props.value} is not a valid 9-digit number`,
      },
      min: 100000000,
      max: 999999999,
    },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return ["M", "F"].includes(v);
        },
        message: "{VALUE} is not a valid gender",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
