var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images'});


router.get('/show/:id', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');

  posts.find({_id:req.params.id}, {}, function(err, post){
      console.log(post);
      res.render('show', {
          title: 'Show Post',
          post: post[0]
      });
  })

});


router.get('/add', function(req, res, next) {
  var db = req.db;
  var categories = db.get('categories');

  categories.find({}, {}, function(err, categories){
      res.render('addpost', {
          title: 'Add Post',
          categories: categories
      });
  })

});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();

  if(req.file){
      var mainimage = req.file.filename;
  }else{
      var mainimage = 'noimage.jpg';
  }

  //Form Valiation
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('body', 'Body field is required').notEmpty();

  //Check Errors
  var errors = req.validationErrors();

  if(errors){
      res.render('addpost', {
          errors: errors
      });
  }else{
      var db = req.db;
      var posts = db.get('posts');
      posts.insert({
          title: title,
          category: category,
          date: date,
          author: author,
          body: body,
          mainimage: mainimage
      }, function(err, post){
          if(err){
              res.send(err);
          }else{
              req.flash('success', 'post added');
              res.redirect('/');
          }
      })
  }
});

module.exports = router;
