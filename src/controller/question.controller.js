const { ApplicationError, NotFoundError } = require("../middleware");
const { parseQuery } = require("../lib");
const {
    QuestionService,
    CommentService,
    CachingService,
} = require("../services/index");
const { Question, Comment } = require("../models");
const RedisClient = require("../loader/RedisLoader");
const questionService = new QuestionService(Question);
const commentService = new CommentService(Comment);
const cachingService = new CachingService(RedisClient);
const COMMENT_BOUND_SIZE = 10;

/**
 *
 */
class QuestionController {
    /**
     * @description addQuestion handles request to add a question asked
     * by a client
     * @param {Objet} req HTTP req object
     * @param {Object} res HTTP res object
     * @param {Function} next This function will invoke the next middleware
     * if an error occurs
     * @return {Object} data indicating successful object creation
     */
    async addQuestion(req, res, next) {
        try {
            const result = await questionService.addQuestion(req.body);
            res.status(200).json(result);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    /**
     * @description retrieves a particular question with the given id
     * in the request params
     * @param {Objet} req HTTP req object
     * @param {Object} res HTTP res object
     * @param {Function} next This function will invoke the next middleware
     * @returns
     */
    async getQuestion(req, res, next) {
        try {
            const { id } = req.params;
            const question = await questionService.getQuestion(id);
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
    /**
     * @description searches the database for question that matches the text
     * in search query
     * @param {Objet} req HTTP req object
     * @param {Object} res HTTP res object
     * @param {Function} next This function will invoke the next middleware
     */
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
            await cachingService.cacheContent("name", "Adeleke");
            const name = await cachingService.retrieveContent("name");
            console.log(name);
            res.status(200).json(results);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    /**
     *@description adds a comment to a particular question thread
     * @param {Objet} req HTTP req object
     * @param {Object} res HTTP res object
     * @param {Function} next This function will invoke the next middleware
     */
    async addComment(req, res, next) {
        try {
            const { id } = req.params;
            const question = await questionService.getQuestion(id);

            if (!question) {
                return next(
                    new NotFoundError("No question exist with this id")
                );
            }
            req.body.createdAt = new Date();
            let questionDoc, comment;

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
