const express = require("express");
const Article = require("../models/article.js");
const router = express.Router();

// to RENDER new article page
router.get("/new", (req, res) => {
  // we set default values in html and its expecting some data passed, thats why
  // we create new object schema and pass that for filler info
  res.render("articles/new", { article: new Article() });
});

// editing route
router.get("/new/:id", async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render("articles/edit", { article: article });
});

// to render old one based on id
router.get("/:slug", async (req, res) => {
  // from database
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");

  // show it if it worked
  res.render("articles/show", { article: article });
});

function saveArticleAndRedirrect(path){
  return async (req,res) =>{
    let article = req.article
    // article schema

    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      // trying to save the form and redirrect to form display page
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      // if we cant make a blog, we will return to same
      // form with details prepopulated
      console.log(e);
      res.render(`articles/${path}`, { article: article });
    }
  }
}

// this is POST req and it goes back in dirrectory thats why we are back from
// /new to catch this req
router.post("/", async (req, res,next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirrect("new"));

router.put("/:id",async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirrect("edit"));

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// to delete something we cant make a delete req,
// it only give post and get req
// so we can use a liberary for 'method override'

module.exports = router;
