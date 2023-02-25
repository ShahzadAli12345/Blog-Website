const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Blog = require("./models/Blog");
const app = express();

//connect to mongoDB
mongoose
  .connect("mongodb://localhost:27017/blogSite")
  .then(() => {
    console.log(`Connection successfully created...`);
  })
  .catch((err) => {
    console.log(`Error occures`);
    console.log(err);
  });

app.use(methodOverride("_method"));

//parsing data form req.body
app.use(express.urlencoded({ extended: true }));

//static assets
app.use(express.static("public"));

//templating engine
app.set("view engine", "ejs");


//home route
app.get("/", (req, res) => {
  Blog.find().sort({_id:-1}).limit(6).exec(function (error, blgs){

    res.render("home", {blgs});
  });
  
});

//training route
app.get("/CreateNewBlo", (req, res) => {
  res.render("CreateNewBlo");
});

//show all blogs
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    // console.log(blogs);
    res.render("blogs/blogs", { blogs });
  } catch (error) {
    console.log(`Error occured`);
    res.send(error.message);
  }
});

//render create new blog page
app.get("/blog/new", (req, res) => {
  res.render("blogs/new");
});

//show search results
app.post("/search", async (req, res) => {
  const { search } = req.body;

  try {
    Blog.find({"category":search,}).exec(function (error, blgs){
      res.render("blogs/search", {blgs});
    });

  } catch (error) {
    console.log(`Error occured`);
  }
});


//create new blog
app.post("/blogs", async (req, res) => {
  const { title, text, img, category, auther, date } = req.body;
  console.log({ title, text, img, category, auther, date });
  const blog = new Blog({
    title,
    text,
    img,
    category,
    auther,
    date
  });
  try {
    await blog.save();
    res.redirect("/blogs");
  } catch (error) {
    console.log(`Error occured`);
    res.send(error.message);
  }
});

//show details page
app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundBlog = await Blog.findById(id);

    res.render("blogs/blog", { foundBlog });
  } catch (error) {
    console.log(`Error occured`);
    res.send(error.message);
  }
});

//edit blog form
app.get("/blogs/:id/edit", async (req, res) => {
  const id = req.params.id;
  const foundBlog = await Blog.findById(id);
  res.render("blogs/update", { foundBlog });
});

//update route
app.patch("/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(foundBlog);
    res.redirect("/blogs");
  } catch (error) {
    console.log(`Error occured`);
    res.send(error.message);
  }
});

//Delete blog
app.delete("/blogs/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/blogs");
  } catch (error) {
    console.log(`Error occured`);
    res.send(error.message);
  }
});

app.listen(5000, () => {
  console.log("Server Listening at PORT 5000");
});
