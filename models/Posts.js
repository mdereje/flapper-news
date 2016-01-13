var mongoose = require('mongoose');
//Comments probably 1 to many relationship.
var PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment'
        }],  
    nComments: { type: Number }
});

PostSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

PostSchema.methods.downvote = function(cb) {
    this.upvotes -= 1;
    this.save(cb);
};

mongoose.model('Post', PostSchema);