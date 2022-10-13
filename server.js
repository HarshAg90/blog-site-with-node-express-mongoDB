const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article.js");
const router = require("./routes/articles");
const articleRouter = require("./routes/articles");

// we cant use link for delete because when google crawl site,
// it clicks on every single link, and 'a' tag button will delete everything
// thats why we need delete method 'like GET POST'
const methodOverride = require("method-override");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/blog");

app.set("view engine", "ejs");
// whenever we use _ this wil be executed
app.use(methodOverride("_method"));
// after this we will createt a Small form with JUST a delete button to summit,
// see index.ejs about method

// granting permission to acccess request.body in article.js
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  // res.send("Hello World")
  const articles = await Article.find().sort({
    createdAt: "desc",
  });

  res.render("articles/index", { articles: articles });
});

// we needed permisions first soo we put this statement
// at last of doc
app.use("/articles", articleRouter);

app.listen(5000);
