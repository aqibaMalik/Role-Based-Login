const router = require("express").Router()
const {
  authenticateUser,
  checkUserRole,

  updateUser,
  createUser,
} = require("../controllers/loginController")
const {
  createProject,
  deleteProject,
  checkProjectAccess,
} = require("../controllers/projectsController")

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard")
  }
  res.render("index")
})

router.get("/Signup", (req, res) => {
  res.render("Signup")
})

router.post("/createUser", createUser, (req, res) => {})
router.get("/dashboard", authenticateUser, (req, res) => {
  if (!req.session.user) {
    return res.redirect("/")
  }
  res.render("welcome", {
    role: req.session.user.role,
    userId: req.session.user._id,
    username: req.session.user.username,
    projects: req.session.projects,
  })
})

router.post("/login", authenticateUser, (req, res) => {
  res.redirect("dashboard")
})

router.post("/updateUser", updateUser, (req, res) => {})

router.post("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error logging out")
      }
      req.session = null
      res.redirect("/")
    })
  } else {
    return res.status(400).send("Not logged in")
  }
})

router.post("/createProject", createProject, (req, res) => {})

router.get("/myProjects/:id", (req, res) => {
  const userId = req.params.id
  const { username } = req.session.user
  const projects = req.session.projects?.filter((project) => {
    return project.createdBy === userId
  })
  res.render("UserProjects", { projects, username })
})

router.get(
  "/projects/:projectId",
  authenticateUser,
  checkProjectAccess,
  (req, res) => {
    const project = req.project
    res.sendStatus(200)
  }
)

router.delete(
  "/deleteProject/:projectId",
  checkProjectAccess,
  deleteProject,
  (req, res) => {}
)
module.exports = router
