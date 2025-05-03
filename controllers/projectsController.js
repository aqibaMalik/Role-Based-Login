const { getProjects } = require("../utils/utils")
const { Project } = require("../models/User")

async function createProject(req, res, next) {
  const { title, description } = req.body
  let id = (await getProjects().then((projects) => projects.length)) + 1
  const newProject = {
    id,
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

async function deleteProject(req, res, next) {
  const projectId = req.params.projectId

  const project = await Project.findOne({ id: projectId })

  if (!project) {
    return res.status(403).send("Unauthorized")
  }

  try {
    await project.deleteOne()
    req.session.projects = req.session.projects.filter(
      (p) => p.id !== projectId
    )
    res.status(200).send("Project deleted successfully")
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { createProject, deleteProject }
