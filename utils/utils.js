const { Project } = require("../models/User")

async function getProjects() {
  const projects = await Project.find()
  return projects
}

module.exports = { getProjects }
