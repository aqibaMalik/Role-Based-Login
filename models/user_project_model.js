const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
})

const projectSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
})

const User = mongoose.model("User", userSchema)
const Project = mongoose.model("Project", projectSchema)

module.exports = { User, Project }
