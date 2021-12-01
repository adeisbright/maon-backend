const app = require("../../src/app");
const chai = require("chai");
chaiHttp = require("chai-http");
const faker = require("faker");
const { Question } = require("../../src/models");
const should = chai.should();
chai.use(chaiHttp);

describe("Question CRUD", () => {
    describe("/POST Question", () => {
        it("Should not add a question if no title in req body", async () => {
            const reqBody = {
                content: faker.lorem.paragraphs(),
            };

            const url = "/v1/questions";
            const response = await chai.request(app).post(url).send(reqBody);
            response.should.have.status("400");
        });

        it("Should add a question", async () => {
            const reqBody = {
                content: faker.lorem.paragraphs(),
                title: "How to build a web search engine",
                author: {
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                },
            };

            const url = "/v1/questions";
            const response = await chai.request(app).post(url).send(reqBody);
            response.should.have.status("200");
        });
    });

    describe("Question search", () => {
        it("Should reject a hit on the search without a query", async () => {
            const url = "/v1/search";
            const response = await chai.request(app).get(url);
            response.should.have.status("400");
            response.body.should.be.an("object");
            response.body.should.have.a.property("message");
        });

        it("Should retrieve a set of questions that matches the query", async () => {
            const query = "How to build a web search engine";

            const url = `/v1/search?q=${query}`;
            const response = await chai.request(app).get(url);
            response.should.have.status("200");
            response.body.should.be.an("array");
            response.body.should.not.be.empty;
        });

        it("Should include only content in the return response object", async () => {
            const query = "How to build a web search engine";

            const url = `/v1/search?q=${query}&filter=content`;
            const response = await chai.request(app).get(url);
            response.should.have.status("200");
            response.body.should.be.an("array");
            response.body.should.not.be.empty;
            response.body[0].should.not.have.property("title");
        });
    });

    describe("/GET/:id Question", () => {
        it("Should reject a request with bad question id", async () => {
            const id = "61a62bcfb40203771e23f4";
            const url = `/v1/questions/${id}`;
            const response = await chai.request(app).get(url);
            response.should.have.status("400");
            response.body.should.be.an("object");
        });

        it("Should tell the user that the question with id does not exist", async () => {
            const id = "61a62bcfb40203771e23f4e5";
            const url = `/v1/questions/${id}`;
            const response = await chai.request(app).get(url);
            response.should.have.status("404");
            response.body.should.be.an("object");
        });

        it("Should retrieve the question", async () => {
            const question = await Question.create({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraphs(),
                author: {
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                },
            });

            const url = `/v1/questions/${question._id}`;

            const response = await chai.request(app).get(url);
            response.should.have.status("200");
            response.body.should.be.an("object");
        });
    });

    describe("Question addComment", () => {
        it("Should add a comment to the question", async () => {
            const id = "61a62bcfb40203771e23f4e4";
            const url = `/v1/questions/${id}/comments`;

            const reqBody = {
                content: faker.lorem.paragraphs(),
                title: faker.lorem.sentence(),
                author: {
                    email: faker.internet.email(),
                    name: faker.name.findName(),
                },
            };
            const response = await chai.request(app).post(url).send(reqBody);
            response.should.have.status("200");
            response.body.should.be.an("object");
            response.body.should.have.property("status").equal("ok");
        });
    });
});
