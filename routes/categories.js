var express = require('express');
var router = express.Router();


router.get('/show/:category', function(req, res, next) {
    var db = req.db;
    var posts = db.get('posts');

    posts.find({category: req.params.category}, {}, function(err, posts){
        res.render('index', {
            title: 'Add Post',
            posts: posts
        });
    })
});



router.get('/add', function(req, res, next) {
  res.render('addcategory', {
      title: 'Add Category'
  });
});

router.post('/add', function(req, res, next) {
  var name = req.body.name;

  //Form Valiation
  req.checkBody('name', 'Name field is required').notEmpty();

  //Check Errors
  var errors = req.validationErrors();

  if(errors){
      res.render('addpost', {
          errors: errors
      });
  }else{
      var db = req.db;
      var categories = db.get('categories');
      categories.insert({
          name: name
      }, function(err, post){
          if(err){
              res.send(err);
          }else{
              req.flash('success', 'Category added');
              res.redirect('/');
          }
      })
  }
});

module.exports = router;
