const chai = require("chai");
const sinon = require("sinon");
const should = chai.should();

const QuestionService = require("../../src/services/QuestionService");
const Question = require("../../src/models/question");

describe("Question Service", () => {
    describe("Add Question", () => {
        it("A question should not be added when the username is not in the payload", async () => {
            let questionData = {
                title: "Example Question",
                content:
                    "I am asking my example question to find out something",
            };

            let question = await new QuestionService(Question).addQuestion(
                questionData
            );

            question.should.have.message("Error");
        });
    });
});
