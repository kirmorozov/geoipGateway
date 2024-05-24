const expect = require('chai').expect;
const {Factory} = require("../factory");



describe('Middleware Cache', () => {
    let factory;

    beforeEach(() => {
        factory = new Factory();
    });

    it("Create Simple Cache", async () => {
        const config = {
            path: "middleware/limit",
            limit: 1,
            term: 1
        };
        const middleware = factory.buildMiddleware(config);

        const dummyProcessClass = class {
            constructor(config) {
                this.counter = 0;
            }
            async process(ip) {
                return ip;
            }
        }
        var instance = new dummyProcessClass({});
        middleware.apply(instance);

        await instance.process("123")
            .then((result) => {
                expect(result).to.equal("123");
                var start = new Date().getTime();
                while (new Date().getTime() < start + 1)
                expect(result).to.equal("123");
                return instance.process("123");
            });

    });
});