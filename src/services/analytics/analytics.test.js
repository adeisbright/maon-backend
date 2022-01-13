const chai = require("chai");
const faker = require("faker");
const sinon = require("sinon");
const AnalyticsService = require("./analytics.service");
const expect = chai.expect;

describe("Analytics Service", () => {
    before(async () => {
        console.log("Return the current analytics page count");
    });

    describe("Page Count", () => {
        it("Should return the page count", async () => {
            //If you need to directly test a code without any of its dependence
            // being taking into action. Kindly test using a mock and not a stub
            // const pageMock = sinon.mock(AnalyticsService);
            // const expectation = pageMock.expects("incrVisit");
            // expectation.withArgs("about");
            // expectation.verify();
            // expect(expectation).atMost(1);

            // This test below worked if you try to just spy the method of an object
            // Call that method and verify if the result was as expected
            const pageSpy = sinon.spy(AnalyticsService);

            const result = await pageSpy.incrVisit("about");

            expect(result).to.be.eq("about");
        });
    });
});
