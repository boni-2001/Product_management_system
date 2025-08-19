require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./app/config/dbCon");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");

// Database connection
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session & Flash
app.use(
  session({
    secret: "witjrewjtore",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Flash middleware locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("upload", express.static(path.join(__dirname, "/upload")));
app.use("/upload", express.static("upload"));

// Routes
const adminRoutes = require("./app/routes/adminRoutes");
app.use("/admin", adminRoutes);

const productRoutes = require("./app/routes/productRoutes");
app.use("/", productRoutes);

// Server start
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
