const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CommentSchema = new mongoose.Schema({
    text:{
        type: String
    },
    items:{
        type: String,
        ref: "Item"
    },
    author:{
        type: String,
        ref: "User"
    }
});

CommentSchema.plugin(timestamp);
const Items = mongoose.model('Comments', CommentSchema);
module.exports = Comments;