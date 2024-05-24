const expect = require('chai').expect;
const {Factory} = require("../factory");



describe('Middleware Cache', () => {
    let factory;

    beforeEach(() => {
        factory = new Factory();
    });

    it("Create Simple Cache", async () => {
        const config = {
            path: "middleware/cache"
        };
        const middleware = factory.buildMiddleware(config);

        const dummyProcessClass = class {
            constructor(config) {
                this.counter = 0;
            }
            async process(ip) {
                this.counter++;
                return ip;
            }
        }
        var instance = new dummyProcessClass({});
        middleware.apply(instance);

        await instance.process("123")
            .then(() => {
            return instance.process("123");
        }).then((result) => {
            expect(result).to.equal("123");
            expect(instance.counter).to.equal(1);
        });

        await instance.process("1234")
            .then(() => {
                return instance.process("1234");
            }).then((result) => {
                expect(result).to.equal("1234");
                expect(instance.counter).to.equal(2);
            });

    });
});