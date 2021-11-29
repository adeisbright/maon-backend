const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 5,
        },
        content: String,
        author: {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
        },
        status: {
            value: {
                type: String,
                enum: ["x", "o", "d"],
                default: "o",
            },
            content: {
                type: String,
                default: "The question is open",
            },
        },
        comments: [
            {
                name: String,
                content: String,
                time: Date,
                createdAt: Date,
                votes: {
                    up: Number,
                    down: Number,
                },
                parentComment: {
                    type: Schema.Types.ObjectId,
                    ref: "comments",
                },
                _id: false,
            },
        ],
    },
    { timestamps: true }
);

QuestionSchema.index({ "$**": "text" }, { weights: { title: 1 } });

const Question = mongoose.model("questions", QuestionSchema);
module.exports = Question;
