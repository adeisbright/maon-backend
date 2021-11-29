const {
    ApplicationError,
    BadRequestError,
    DbError,
    NotFoundError,
} = require("../middleware");
const { parseQuery } = require("../lib");
const { QuestionService } = require("../services/index");
const { Question } = require("../models");
const questionService = new QuestionService(Question);

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
}

module.exports = new QuestionController();
