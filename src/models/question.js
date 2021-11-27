const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        author: {
            userName: String,
        },
        responses: [
            {
                name: String,
                content: String,
                time: Date,
            },
        ],
    },
    { timestamps: true }
);

QuestionSchema.index({ title: 1, content: 1, createdAt: 1 });

module.exports = mongoose.model("questions", QuestionSchema);
