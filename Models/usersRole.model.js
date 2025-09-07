import mongoose from "mongoose";

const usersRole = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", usersRole);
