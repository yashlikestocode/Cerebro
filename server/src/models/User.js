import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  supabaseId: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
  },

  name: String,
  avatar: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);
