import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let users = [];
let posts = [];
let isLoggedIn = false;
let currentUser = null;

/* ================= HOME ================= */

app.get("/", (req, res) => {
    res.render("index", {
        posts: posts,
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

app.post("/signup", (req, res) => {
    const { name, password } = req.body;

    users.push({ name, password });

    isLoggedIn = true;
    currentUser = name;

    res.redirect("/");
});

app.post("/login2", (req, res) => {
    const { name, password } = req.body;

    const foundUser = users.find(
        user => user.name === name && user.password === password
    );

    if (foundUser) {
        isLoggedIn = true;
        currentUser = foundUser.name;
        res.redirect("/");
    } else {
        res.send("Wrong credentials");
    }
});

app.get("/out", (req, res) => {
    isLoggedIn = false;
    currentUser = null;
    res.redirect("/");
});

/* ================= CREATE POST ================= */

app.get("/post", (req, res) => {
    if (!isLoggedIn) {
        return res.redirect("/login");
    }

    res.render("post", { cond: isLoggedIn });
});

app.post("/compose", (req, res) => {
    if (!isLoggedIn) {
        return res.redirect("/login");
    }

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

app.post("/delete/:id", (req, res) => {
    const id = Number(req.params.id);

    posts = posts.filter(post => post.id !== id);

    res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
    const id = Number(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.redirect("/");
    }

    res.render("edit", { post: post });
});


app.post("/edit2/:id", (req, res) => {
    const id = Number(req.params.id);

    const post = posts.find(p => p.id === id);

    if (post) {
        post.title = req.body.title;
        post.content = req.body.content;
    }

    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
