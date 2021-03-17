const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const debug = require('debug')('app');
var md5 = require('md5');

mongoose.connect('mongodb://localhost:27017/unsplashDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const imageSchema = new mongoose.Schema({
  name: String,
  src: String,
});
const userSchema = new mongoose.Schema({
  password: String,
});

const Password = mongoose.model('Password', userSchema);
const Image = mongoose.model('Image', imageSchema);

const app = express();
const images = [
  {
    name: 'girl',
    src:
      'https://images.unsplash.com/photo-1615632330105-92ddf6cc7c0c?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'colors',
    src:
      'https://images.unsplash.com/photo-1615615307921-1f456bc82a08?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'flight',
    src:
      'https://images.unsplash.com/photo-1615561916422-7014e1078997?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'tech',
    src:
      'https://images.unsplash.com/photo-1615560226025-08cc084dcde8?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'guy',
    src:
      'https://images.unsplash.com/photo-1547656807-9733c2b738c2?ixid=MXwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyNXx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'forest',
    src:
      'https://images.unsplash.com/photo-1615591360162-5efb9a4c458f?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0N3x8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
];

app.set('view engine', 'ejs');
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  Image.find((err, foundImages) => {
    if (err) {
      debug(err);
    }
    if (foundImages.length === 0) {
      Image.insertMany(images, (err, savedDocs) => {
        if (!err) {
          res.redirect('/');
        }
      });
    } else {
      res.render('index', { images: foundImages });
    }
  });
});

app.get('/add', (req, res) => {
  res.render('addphoto');
});

app.post('/add', (req, res) => {
  const { name, source } = req.body;
  const newImage = new Image({ name, src: source });
  newImage.save((err, savedImage) => {
    if (!err) {
      debug(savedImage);
      res.redirect('/');
    }
  });
});

app.post('/delete', (req, res) => {
  debug(req.body);
  const password = md5(req.body.password);
  const id = req.body.id;
  Password.findOne({ password }, (err, foundPassword) => {
    if (err) {
      debug(err);
    } else {
      if (foundPassword) {
        debug(foundPassword);
        Image.findByIdAndDelete(id, (err, deletedDoc) => {
          if (err) {
            debug(err);
          } else {
            debug(deletedDoc);
            res.redirect('/');
          }
        });
      } else {
        const newPassword = new Password({
          password: password,
        });
        newPassword.save((err, savedPassword) => {
          if (err) {
            debug(err);
          } else {
            Image.findByIdAndDelete(id, (err, deletedDoc) => {
              if (err) {
                debug(err);
              } else {
                debug(deletedDoc);
                res.redirect('/');
              }
            });
          }
        });
      }
    }
  });
});

app.get('/search', (req, res) => {
  res.render('searchPhotos');
});

app.post('/search', (req, res) => {
  const { searchName } = req.body;
  Image.find({ name: searchName }, (err, foundImages) => {
    if (!err) {
      if (foundImages) {
        debug(foundImages);
        res.render('searchPhotos', { images: foundImages });
      } else {
        res.redirect('/');
      }
    }
  });
});

app.listen(4000, () => debug('Server is running on port 4000'));
