import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Project Manager", "Team member"],
    default: "Team member",
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt)
    }
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    console.log(error)
    throw error;
  }
}

const User = mongoose.model("User", userSchema);
export default User;