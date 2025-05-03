require("dotenv").config()
const path = require("path")

const express = require("express")
const app = express()
const port = 3000
const mongoose = require("mongoose")
const session = require("express-session")
const loginRouter = require("./routes/loginRouter")

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err)
  })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
)
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)

app.use("/", loginRouter)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
