import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

/* ================= DATA ================= */

let users = [];
let posts = [];
let isLoggedIn = false;
let currentUser = null;

/* ================= HELPER ================= */

function requireLogin(req, res, next) {
    if (!isLoggedIn) {
        return res.redirect("/login");
    }
    next();
}

/* ================= HOME ================= */

app.get("/", (req, res) => {
    res.render("index", {
        posts,
        cond: isLoggedIn,
        user: currentUser
    });
});

/* ================= LOGIN & SIGNUP ================= */

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/sign", (req, res) => {
    res.render("sign");
});

/* ---------- SIGNUP ---------- */

app.post("/signup", (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.send("Please fill all fields");
    }

    const existingUser = users.find(user => user.name === name);

    if (existingUser) {
        return res.send("User already exists");
    }

    users.push({ name, password });

    isLoggedIn = true;
    currentUser = name;

    res.redirect("/");
});

/* ---------- LOGIN ---------- */

app.post("/login2", (req, res) => {
    const { name, password } = req.body;

    const foundUser = users.find(
        user => user.name === name && user.password === password
    );

    if (!foundUser) {
        return res.send("Wrong credentials");
    }

    isLoggedIn = true;
    currentUser = foundUser.name;

    res.redirect("/");
});

/* ---------- LOGOUT ---------- */

app.get("/out", (req, res) => {
    isLoggedIn = false;
    currentUser = null;

    res.redirect("/");
});

/* ================= CREATE POST ================= */

app.get("/post", requireLogin, (req, res) => {
    res.render("post", { cond: isLoggedIn });
});

app.post("/compose", requireLogin, (req, res) => {

    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        author: currentUser
    };

    posts.push(newPost);

    res.redirect("/");
});

/* ================= DELETE POST ================= */

app.post("/delete/:id", requireLogin, (req, res) => {

    const id = Number(req.params.id);

    posts = posts.filter(post => {
        return !(post.id === id && post.author === currentUser);
    });

    res.redirect("/");
});

/* ================= EDIT POST ================= */

app.get("/edit/:id", requireLogin, (req, res) => {

    const id = Number(req.params.id);

    const post = posts.find(
        p => p.id === id && p.author === currentUser
    );

    if (!post) {
        return res.redirect("/");
    }

    res.render("edit", { post });
});

app.post("/edit2/:id", requireLogin, (req, res) => {

    const id = Number(req.params.id);

    const post = posts.find(
        p => p.id === id && p.author === currentUser
    );

    if (post) {
        post.title = req.body.title;
        post.content = req.body.content;
    }

    res.redirect("/");
});

/* ================= SERVER ================= */

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});