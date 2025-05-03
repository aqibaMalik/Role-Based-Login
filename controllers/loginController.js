const { User, Project } = require("../models/User")
const { getProjects } = require("../utils/utils")

const checkUserRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user

    if (user && user.role === requiredRole) {
      next()
    } else {
      res.status(403).send("Unauthorized")
    }
  }
}

const authenticateUser = async (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user
    return next()
  }
  const { username, password, role } = req.body
  const user = await User.findOne({ username, password })

  if (
    user &&
    username === user.username &&
    password === user.password &&
    role === user.role
  ) {
    const projects = await getProjects()

    req.session.user = user
    req.session.projects = projects

    next()
  } else {
    res.status(404).render("error")
  }
}

async function createUser(req, res, next) {
  const { username, password } = req.body
  try {
    const existingUser = await User.find({ username })

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = await User.create({
      username,
      password,
    })
    if (user) {
      res.status(201).json({ message: "User Created" })
      next()
    } else {
      res.status(400).json({ message: "User not created" })
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" })
    next(err)
  }
}

async function updateUser(req, res) {
  const { username, password } = req.body
  const userId = req.session.user._id

  try {
    const user = await User.findById(userId)
    if (user.username === username && user.password === password) {
      return res.status(400).send("New username cann't be same as old username")
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, password },
      { new: true }
    )
    req.session.user = updatedUser
    res.status(200).send("User updated successfully")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
}

const checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId

    const user = await User.findOne({ _id: req.session.user._id })

    const project = await Project.findOne({
      id: projectId,
      createdBy: user._id,
    }).populate("createdBy")

    if (!project) {
      return res.status(403).send("Unauthorized")
    }
    req.project = project
    next()
  } catch (error) {
    res.status(500).send("Internal server error")
  }
}

module.exports = {
  checkUserRole,
  authenticateUser,
  checkProjectAccess,
  updateUser,
  createUser,
}
