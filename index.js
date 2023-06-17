const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory data store for articles
let articles = [];

// Get all articles
app.get('/articles', (req, res) => {
  res.json({ articles: articles });
});

// Add a new article
app.post('/articles', (req, res) => {
  const { title, content } = req.body;
  const newArticle = { title: title, content: content, views: 0 };
  articles.push(newArticle);
  res.json(newArticle);
});

// Update an article
app.put('/articles/:id', (req, res) => {
  const articleId = parseInt(req.params.id);
  const { title, content } = req.body;

  const article = articles.find(article => articleId === article.id);
  if (article) {
    article.title = title;
    article.content = content;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Remove an article
app.delete('/articles/:id', (req, res) => {
  const articleId = parseInt(req.params.id);
  const articleIndex = articles.findIndex(article => articleId === article.id);
  if (articleIndex !== -1) {
    articles.splice(articleIndex, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
