const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const {QuestionService} = require("../../src/services");
const QuestionController = require("../../src/controller/question.controller");
const should = chai.should();

describe("Question Controller", () => {
  describe("Add Question", () => {
    let res; let next; let status; let json; let questionService;
    // The problem with this controller is because it is tightly coupled with the service
    // So, the service cannot be reproduced outside the place where our controller is declared
    // That is a bad design
    beforeEach(async () => {
      status = sinon.stub();
      (next = sinon.stub()), (json = sinon.spy());
      res = {json, status};
      status.returns(res);
      const Question = sinon.spy();
      questionService = new QuestionService(Question);
    });
    it("Should not add a question that has no title", async () => {
      const req = {
        body: {
          content: faker.lorem.paragraphs,
          author: {
            name: faker.name.findName(),
            email: faker.internet.email(),
          },
        },
      };

      const result = new QuestionController(questionService).addQuestion(
          req,
          res,
          next,
      );
      result.should.have.property("error");
      result.should.have.property("status").equal(400);
    });
  });
});
