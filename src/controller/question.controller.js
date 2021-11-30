const {
    ApplicationError,
    BadRequestError,
    DbError,
    NotFoundError,
} = require("../middleware");
const { parseQuery } = require("../lib");
const { QuestionService, CommentService } = require("../services/index");
const { Question, Comment } = require("../models");
const questionService = new QuestionService(Question);
const commentService = new CommentService(Comment);
const COMMENT_BOUND_SIZE = 10;

class QuestionController {
    async addQuestion(req, res, next) {
        try {
            let result = await questionService.addQuestion(req.body);
            res.status(200).json(result);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getQuestion(req, res, next) {
        try {
            const { id } = req.params;
            let question = await questionService.getQuestion(id);
            if (!question) {
                return next(
                    new NotFoundError("No question exist with this id")
                );
            }
            res.status(200).json({ data: question });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async search(req, res, next) {
        try {
            const { query, filters, skip, limit } = parseQuery(req.query);
            let results = [];
            if (query) {
                results = await questionService.searchQuestion(
                    query,
                    filters,
                    skip,
                    limit
                );
            }
            res.status(200).json(results);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async addComment(req, res, next) {
        try {
            let { id } = req.params;
            let question = await questionService.getQuestion(id);

            if (!question) {
                return next(
                    new NotFoundError("No question exist with this id")
                );
            }
            req.body.createdAt = new Date();
            let comment, questionDoc;

            if (
                question.comments &&
                question.comments.length < COMMENT_BOUND_SIZE
            ) {
                [questionDoc, comment] = await Promise.all([
                    questionService.addComment(id, "comments", req.body),
                    commentService.addComment(req.body),
                ]);
            } else {
                comment = await commentService.addComment(req.body);
            }
            res.status(200).json(comment);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
}

module.exports = new QuestionController();
