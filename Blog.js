const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  img: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
   auther: {
    type: String,
    required: true,
  },
   date: {
    type: Date,
    required: true,
  },
});

//collection creation

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
