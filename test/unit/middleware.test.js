const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const { errorParser, Validator } = require("../../src/middleware");
const should = chai.should();

describe("Middleware", () => {
    describe("Validate user request during resource creation or update", () => {
        it("Should not end the request when no title is found", async () => {});
    });
    describe.skip("Error Handler", () => {
        let status, json, req, res;
        before("Create the request object", async () => {
            req = sinon.stub();
            status = sinon.stub();
            json = sinon.spy();
            res = { json, status };
        });

        it("Should return the appropriate response and status code", async () => {
            const req = sinob.stub().Throw();
            let response = errorParser();
        });
    });
});
