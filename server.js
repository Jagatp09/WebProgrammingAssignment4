/*********************************************************************************
 * WEB700 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Jagat Pareshbhai Patel Student ID: 118557248 Date: 08-03-2025
 *
 * Online (Vercel) Link: ________________________________________________________
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");

const app = express();

// Middleware
app.use(express.static("views"));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Initialize the data (no need to tie this to app.listen for Vercel)
collegeData.initialize()
    .then(() => {
        console.log("Data initialized successfully");
    })
    .catch((err) => {
        console.error("Failed to initialize data: ", err);
    });

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((students) => res.json(students))
            .catch(() => res.json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then((students) => res.json(students))
            .catch(() => res.json({ message: "no results" }));
    }
});

app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((tas) => res.json(tas))
        .catch(() => res.json({ message: "no results" }));
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((courses) => res.json(courses))
        .catch(() => res.json({ message: "no results" }));
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then((student) => res.json(student))
        .catch(() => res.json({ message: "no results" }));
});

app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            res.status(500).send("Unable to add student.");
        });
});

// 404 Route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Export the app for Vercel
module.exports = app;