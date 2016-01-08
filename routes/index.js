var express = require('express');
var router = express.Router();
//@mdereje
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

//@mdereje
router.get('/posts', function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) { return next(err); }
        res.json(posts);
    });
});

//@mdereje POST call so that adding data to the database is possible.
router.post('/posts', function (req, res, next) {
    var post = new Post(req.body);
    post.save(function (err, post) {
        if (err) { return next(err); }
        res.json(post);
    });
});

//@mdereje preloading post objects
router.param('post', function (req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post) {
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post ')); }

        req.post = post;
        return next();

    });
});
//@mdereje route for returning a single post
router.get('/post/:post', function (req, res) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }
        res.json(post);
    });    
});

//@mdereje route for upvoting
router.put('/posts/:post/upvote', function (req, res, next) {
    req.post.upvote(function (err, post) {
        if (err) { return next(err); }
        res.json(post);
    });
});

//@mdereje route comments for a particular post
router.post('/post/:post/comments', function (req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function (err, comment) {
        if (err) { return next(err); }

        req.post.comments.push(comment);
        req.post.save(function (err, post) {
            if (err) { return next(err); }
            res.json(comment);
        });
    });
});

//@mdereje route comment upvotes
router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
    req.post.comments.comment.upvote(function (err, post) {
        if (err) { return next(err); }
        res.json(post);
    });
});

//@mdereje route for pre loading comments
router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);
    query.exec(function (err, comment){
        if (err) { return next(err); }
        if (!comment) { return next( new Error('can\'t find comment')); }
        req.comment = comment;
        return next();
    });
});


// /* GET home page. */
// router.get('/', function (req, res, next) {
//     res.render('index', { title: 'Express' });
// });

module.exports = router;
