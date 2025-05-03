const { getProjects } = require("../utils/utils")
const { Project } = require("../models/user_project_model")
const { User } = require("../models/user_project_model")

async function createProject(req, res, next) {
  const { title, description } = req.body
  const newProject = {
    createdBy: req.session.user._id,
    title,
    description,
  }
  try {
    const savedProject = await Project.create(newProject)
    req.session.projects.push(savedProject)
    res.status(201).send("Project created successfully")
    next()
  } catch (err) {
    next(err)
  }
}

const checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId

    const user = await User.findOne({ _id: req.session.user._id })

    const project = await Project.findOne({
      _id: projectId,
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

async function deleteProject(req, res, next) {
  const projectId = req.params.projectId

  const project = await Project.findOne({ _id: projectId })

  if (!project) {
    return res.status(403).send("Unauthorized")
  }

  try {
    await project.deleteOne()
    req.session.projects = req.session.projects.filter(
      (p) => p._id !== projectId
    )
    res.status(200).send("Project deleted successfully")
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { createProject, deleteProject, checkProjectAccess }
