const { Project } = require("../models/user_project_model")

async function getProjects() {
  const projects = await Project.find()
  return projects
}

module.exports = { getProjects }
