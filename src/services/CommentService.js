class CommentService {
  constructor(model) {
    this.Model = model;
  }
  /**
     * @description adds a question to the database
     * @param {Objet} question the data object the user asked
     * @returns the created question document
     *
     */

  async addComment(commentDetail) {
    try {
      await this.Model.create(commentDetail);
      return {
        status: "ok",
        statusCode: 200,
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = CommentService;
