let express = require("express");
let app = express();
let path = require("path");
let port = 3000;
let bodyParser = require("body-parser");

let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./Registration.db",
  },
  useNullAsDefault: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  knex
    .select("student_id", "first_name", "last_name", "email")
    .from("students")
    .orderBy("student_id")
    .then((student) => {
      res.render("index", { test: student });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

app.post("/DeleteStudent/:id", (req, res) => {
  knex("students")
    .where("student_id", req.params.id)
    .del()
    .then((student) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

app.get("/addBatch", (req, res) => {
  knex("students")
    .insert([
      { first_name: "Tony", last_name: "Stark", email: "Y" },
      { first_name: "Steve", last_name: "Rogers", email: "Y" },
      { first_name: "Natasha", last_name: "Romanoff", email: "N" },
      { first_name: "Carol", last_name: "Danvers", email: "N" },
    ])
    .then((student) => {
      res.redirect("/", { test: student });
    });
});

app.get("/addStudent", (req, res) => {
  res.render("addStudent");
});

app.post("/addStudent", (req, res) => {
  knex("students")
    .insert(req.body)
    .then((student) => {
      res.redirect("/");
    });
});

app.get("/updateStudent", (req, res) => {
  res.render("updateStudent");
});

app.post("/updateStudent", (req, res) => {
  console.log(req.body.first_name);

  knex("students")
    .where({ student_id: req.body.student_id })
    .update({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    })
    .then((student) => {
      res.redirect("/");
    });
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname + "/about.html"));
});

app.get("/email", function (req, res) {
  res.sendFile(path.join(__dirname + "/emailpage.html"));
});

app.listen(port, function () {
  console.log("j'écoute les mouvements ");
});
