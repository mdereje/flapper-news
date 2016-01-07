var express = require('express');
var router = express.Router();
//@mdereje
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

//@mdereje
router.get('/posts', function(req, res, next){
    Post.find(function(err, posts){
       if(err){ return next(err); }
       res.json(posts); 
    });    
});

//@mdereje POST call so that adding data to the database is possible.
router.post('/posts', function( req, res, next) {
    var post = new Post(req.body);
    post.save(function(err, post){
        if(err){ return next(err); }
        res.json(post);
    });
});

//@mdereje preloading post objects
router.param('post', function(req, res, next, id) {
   var query = Post.findById(id);
   
   query.exec(function(err, post){
       if(err) { return next(err); }
       if(!post) { return next(new Error('can\'t find post ')); }
       
       req.post = post;
       return next();
       
   });   
});
//@mdereje route for returning a single post
router.get('/post/:post', function(req, res) {
    res.json(req.post);
});

//@mdereje route for upvoting
router.put('/posts/:post/upvote', function(req, res, next) {
    req.post.upvote(function(err, post){
        if (err) { return next(err); }
        res.json(post);
    })
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
