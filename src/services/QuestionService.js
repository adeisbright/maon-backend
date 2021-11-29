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
            await this.Model.create(question);
            return {
                status: "ok",
                code: 200,
                data: question,
            };
        } catch (error) {
            return error;
        }
    }

    async getQuestion(id) {
        return await this.Model.findOne({ _id: id });
    }

    async searchQuestion(text, filter = {}, skip = 0, limit = 10) {
        try {
            let results = await this.Model.find({ $text: { $search: text } })
                .skip(skip)
                .limit(limit)
                .select(filter)
                .lean();
            return results;
        } catch (error) {
            return error;
        }
    }
}

module.exports = QuestionService;
