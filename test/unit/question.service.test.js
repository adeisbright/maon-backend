const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const { QuestionService } = require("../../src/services");
const { Question } = require("../../src/models");
const questionService = new QuestionService(Question);

const should = chai.should();
const expect = chai.expect;

describe("Question Service", () => {
    describe("Create Question", () => {
        let stub = sinon.stub();
        after("Restore the object properties", () => {
            stub.restore();
        });

        it("Should be able to create question", async function () {
            let questionData = {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraphs(),
                author: {
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                },
            };

            // Stub the Question model for use by the service
            stub = sinon.stub(Question, "create").returns(questionData);

            let query = await questionService.addQuestion(stub);

            query.should.have.property("title");
            query.should.have.property("content").equal(questionData.content);
        });
    });
});
