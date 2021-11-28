class QuestionService {
    constructor(model) {
        this.Model = model;
    }
    async addQuestion(question) {
        return await this.Model.create(question);
    }
    async getQuestions() {}
    async getQuestion() {}
    async deleteQuestion() {}
}

module.exports = QuestionService;
