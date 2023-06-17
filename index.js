const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blogDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define the article schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  views: { type: Number, default: 0 }
});

// Create the article model
const Article = mongoose.model('Article', articleSchema);

// Get all articles
app.get('/articles', (req, res) => {
  Article.find()
    .then(articles => {
      res.json({ articles: articles });
    })
    .catch(err => {
      console.error('Error getting articles:', err);
      res.sendStatus(500);
    });
});

// Add a new article
app.post('/articles', (req, res) => {
  const { title, content } = req.body;
  const newArticle = new Article({ title: title, content: content });

  newArticle.save()
    .then(article => {
      res.json(article);
    })
    .catch(err => {
      console.error('Error adding article:', err);
      res.sendStatus(500);
    });
});

// Update an article
app.put('/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const { title, content } = req.body;

  Article.findByIdAndUpdate(articleId, { title: title, content: content }, { new: true })
    .then(article => {
      if (article) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error('Error updating article:', err);
      res.sendStatus(500);
    });
});

// Remove an article
app.delete('/articles/:id', (req, res) => {
  const articleId = req.params.id;

  Article.findByIdAndRemove(articleId)
    .then(article => {
      if (article) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error('Error removing article:', err);
      res.sendStatus(500);
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
