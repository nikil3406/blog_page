import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

/* DATA */

let users = [];
let isLoggedIn = false;
let currentUser = null;

/* LOGIN CHECK */

function requireLogin(req, res, next) {
    if (!isLoggedIn) {
        return res.redirect("/login");
    }
    next();
}

/* HOME */

app.get("/", async (req, res) => {

    const result = await axios.get(`${API_URL}/posts`);

    res.render("index", {
        posts: result.data,
        cond: isLoggedIn,
        user: currentUser
    });
});

/* LOGIN */

app.get("/login", (req, res) => {
    res.render("login");
});

/* SIGNUP */

app.get("/sign", (req, res) => {
    res.render("sign");
});

app.post("/signup", (req, res) => {

    const { name, password } = req.body;

    const existingUser = users.find(u => u.name === name);

    if (existingUser) {
        return res.redirect("/login");
    }

    users.push({ name, password });

    isLoggedIn = true;
    currentUser = name;

    res.redirect("/");
});

/* LOGIN */

app.post("/login2", (req, res) => {

    const { name, password } = req.body;

    const foundUser = users.find(
        u => u.name === name && u.password === password
    );

    if (!foundUser) {
        return res.send("Wrong credentials");
    }

    isLoggedIn = true;
    currentUser = foundUser.name;

    res.redirect("/");
});

/* LOGOUT */

app.get("/out", (req, res) => {

    isLoggedIn = false;
    currentUser = null;

    res.redirect("/");
});

/* CREATE POST */

app.get("/post", requireLogin, (req, res) => {
    res.render("post");
});

app.post("/compose", requireLogin, async (req, res) => {

    await axios.post(`${API_URL}/posts`, {
        title: req.body.title,
        content: req.body.content,
        author: currentUser
    });

    res.redirect("/");
});

/* DELETE */

app.get("/delete/:id", requireLogin, async (req, res) => {

    await axios.delete(`${API_URL}/posts/${req.params.id}`);

    res.redirect("/");
});

/* EDIT */

app.get("/edit/:id", requireLogin, async (req, res) => {

    const result = await axios.get(`${API_URL}/posts/${req.params.id}`);

    res.render("edit", { post: result.data });
});

app.post("/edit2/:id", requireLogin, async (req, res) => {

    await axios.patch(`${API_URL}/posts/${req.params.id}`, {
        title: req.body.title,
        content: req.body.content
    });

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Frontend running on port ${port}`);
});