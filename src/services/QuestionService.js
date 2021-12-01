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
        statusCode: 200,
      };
    } catch (error) {
      return error;
    }
  }

  async getQuestion(id) {
    return await this.Model.findOne({_id: id});
  }

  async searchQuestion(text, filter = {}, skip = 0, limit = 10) {
    try {
      await this.Model.collection.createIndex(
          {"$**": "text"},
          {weights: {title: 1}},
      );
      const results = await this.Model.find({$text: {$search: text}})
          .skip(skip)
          .limit(limit)
          .select(filter)
          .lean();
      return results;
    } catch (error) {
      return error;
    }
  }

  async addComment(questionId, field, commentDetail) {
    const doc = await this.Model.findByIdAndUpdate(
        questionId,
        {
          $push: {
            [field]: commentDetail,
          },
        },
        {
          useFindAndModify: false,
          new: true,
        },
    );
    return doc;
  }
}

module.exports = QuestionService;
