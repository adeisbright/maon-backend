const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const {QuestionService} = require("../../src/services");
const {Question} = require("../../src/models");
const questionService = new QuestionService(Question);

const should = chai.should();

describe("Question Service", () => {
  describe("Create Question", () => {
    let stub = sinon.stub();
    afterEach("Restore the object properties", () => {
      stub.restore();
    });

    it("Should be able to create question", async () => {
      const questionData = {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        author: {
          name: faker.name.findName(),
          email: faker.internet.email(),
        },
      };

      stub = sinon.stub(Question, "create").returns(questionData);

      const {status, statusCode} = await questionService.addQuestion(
          stub,
      );

      status.should.be.a("string");
      status.should.equal("ok");
      statusCode.should.not.be.null;
      statusCode.should.be.equal(200);
    });
  });
});
