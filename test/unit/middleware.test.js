const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const { errorParser, Validator } = require("../../src/middleware");
const should = chai.should();
const expect = chai.expect;

describe("Middleware", () => {
    describe("Add Question", () => {
        it("Should  called next at least once", async () => {
            const req = {
                body: {
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraphs(),
                    author: {
                        name: faker.name.findName(),
                        email: faker.internet.email(),
                    },
                },
            };

            const next = sinon.spy();
            const res = {};
            await Validator.validateAddQuestion(req, res, next);
            expect(next.calledOnce).to.be.true;
        });
        it("Should  throw an error when question author is missing", async () => {
            const req = {
                body: {
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraphs(),
                },
            };

            const next = sinon.spy();
            const json = sinon.stub();
            const status = sinon.stub();
            const res = { json, status };
            await Validator.validateAddQuestion(req, res, next);
            console.log(res);
            expect(next.called).to.be.true;
            res.should.have.property("message");
        });
    });
    // describe.skip("Error Handler", () => {
    //   let status; let json; let req; let res;
    //   before("Create the request object", async () => {
    //     req = sinon.stub();
    //     status = sinon.stub();
    //     json = sinon.spy();
    //     res = {json, status};
    //   });

    //   it("Should return the appropriate response and status code", async () => {
    //     const req = sinob.stub().Throw();
    //     const response = errorParser();
    //   });
    // });
});
