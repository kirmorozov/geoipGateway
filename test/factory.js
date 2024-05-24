const expect = require('chai').expect;
const {Factory} = require("../factory");

describe('Factory', () => {
    let factory;

    beforeEach(() => {
        const config = {}; // provide any necessary configuration here
        factory = new Factory();
    });

    it("Create Simple Adapter", () => {
        const config = {
            "path": "adapter/ipapi"
        };
        const result = factory.buildAdapter(config);
        expect(typeof result.process).to.equal('function');
    });

    it("Create Simple Adapter with middleware", () => {
        const config = {
            "path": "adapter/ipapi",
            "middleware": [{
                "path": "middleware/cache"
            }]
        };
        const result = factory.buildAdapter(config);
        expect(typeof result.process).to.equal('function');
    });

    it("Create Simple Strategy", () => {
        const config = {
            "path": "strategy/fallback"
        };
        const result = factory.buildStrategy(config);
        expect(typeof result.process).to.equal('function');
    });
});
