const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: {
        name: String,
        email: String,
    },
    content: String,
    createdAt: Date,
    votes: {
        up: Number,
        down: Number,
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "comments",
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "questions",
    },
});

CommentSchema.index({ content: 1, createdAt: 1 });

module.exports = mongoose.model("comments", CommentSchema);
