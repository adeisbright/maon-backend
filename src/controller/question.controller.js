const { QuestionService } = require("../services");
const { Question } = require("../models");
const questionService = new QuestionService(Question);

class QuestionController {
    async addQuestion(req, res) {
        try {
            let question = await questionService.addQuestion(req.body);
            res.status(200).json(question);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async getQuestions(req, res) {
        try {
            let questions = await questionService.getQuestions();
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}

module.exports = new QuestionController();
