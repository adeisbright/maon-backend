const chai = require("chai");
const { parseQuery } = require("../../src/lib");
const sinon = require("sinon");
const faker = require("faker");
const should = chai.should();

describe("Helper functions", () => {
    describe("Request Query Parser", () => {
        it("Should return the formatted query options as an object", () => {
            let obj = {
                q: faker.lorem.sentence(),
                limit: faker.datatype.number(),
                page_no: faker.datatype.number(),
                filter: `${faker.lorem.word()} , ${faker.lorem.word()}`,
            };

            let { query, skip, limit, filters } = parseQuery(obj);

            query.should.equal(obj.q);

            filters.should.be.an("object");
            skip.should.not.be.null;
            limit.should.not.be.null;
            skip.should.be.a("number");
        });
    });
});
