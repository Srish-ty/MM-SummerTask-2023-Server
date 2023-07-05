import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { usernm, pswd } from './credentials/credentials.js';

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${usernm}:${pswd}@cluster0mm.ryumqgd.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully!..');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// article schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
});

//  article 
const Article = mongoose.model('Article', articleSchema);

// Get all articles
app.get('/articles', (req, res) => {
  Article.find()
    .then(articles => {
      //window.alert('here are the articles!!');
      res.json({ articles: articles });
      console.log('showing srticles')
    })
    .catch(err => {
      console.error('Error getting articles:', err);
      res.sendStatus(500);
    });
});

// Add a new article
app.post('/articles', (req, res) => {
  const { title, content, category } = req.body;
  console.log(req.body);

  const newArticle = new Article({ title: title, content: content, category:category });

  newArticle.save()
    .then(article => {
      res.json(article);
      console.log('article added !'); //window.alert('Article has been added !');
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

// next endpoints -->

// API endpoint to get articles by category
app.get('/articles/:category', (req, res) => {
  const category = req.params.category;

  // Find articles by category in the database
  Article.find({ category }, (err, articles) => {
    if (err) {
      console.error('Error retrieving articles:', err);
      res.status(500).json({ error: 'Failed to retrieve articles' });
    } else {
      res.status(200).json(articles);
    }
  });
});


// API endpoint to update views for an article
app.put('/articles/:id/views', (req, res) => {
  const articleId = req.params.id;

  // Update views for the article
  Article.findByIdAndUpdate(
    articleId,
    { $inc: { views: 1 } },
    { new: true },
    (err, updatedArticle) => {
      if (err) {
        console.error('Error updating article views:', err);
        res.status(500).json({ error: 'Failed to update article views' });
      } else if (updatedArticle) {
        res.status(200).json(updatedArticle);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    }
  );
});

// API endpoint to update likes for an article
app.put('/articles/:id/likes', (req, res) => {
  const articleId = req.params.id;

  // Update likes for the article
  Article.findByIdAndUpdate(
    articleId,
    { $inc: { likes: 1 } },
    { new: true },
    (err, updatedArticle) => {
      if (err) {
        console.error('Error updating article likes:', err);
        res.status(500).json({ error: 'Failed to update article likes' });
      } else if (updatedArticle) {
        res.status(200).json(updatedArticle);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    }
  );
});

const port = 8000;
app.listen(port, () => {
  console.log('Server is running on port',port);
});
