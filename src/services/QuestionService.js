class QuestionService {
    constructor(model) {
        this.Model = model;
    }
    /**
     * @description adds a question to the database
     * @param {Objet} question the data object the user asked
     * @returns the created question document
     *
     */
    async addQuestion(question) {
        try {
            return await this.Model.create(question);
        } catch (error) {
            return error;
        }
    }
    async getQuestions() {
        return await this.Model.find({});
    }
    async getQuestion() {}
}

module.exports = QuestionService;
