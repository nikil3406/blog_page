import express from "express";

const app = express();
const port = 4000;

app.use(express.json());

let posts = [];

/* GET ALL POSTS */
app.get("/posts", (req, res) => {
    res.json(posts);
});

/* CREATE POST */
app.post("/posts", (req, res) => {

    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    posts.push(newPost);

    res.status(201).json(newPost);
});

/* DELETE POST */
app.delete("/posts/:id", (req, res) => {

    const id = Number(req.params.id);

    posts = posts.filter(post => post.id !== id);

    res.json({ message: "Post deleted" });
});

/* GET SINGLE POST */
app.get("/posts/:id", (req, res) => {

    const id = Number(req.params.id);

    const post = posts.find(p => p.id === id);

    res.json(post);
});

/* UPDATE POST */
app.patch("/posts/:id", (req, res) => {

    const id = Number(req.params.id);

    const post = posts.find(p => p.id === id);

    if (post) {
        post.title = req.body.title;
        post.content = req.body.content;
    }

    res.json(post);
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});