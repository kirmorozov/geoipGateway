const expect = require('chai').expect;
const {Factory} = require("../factory");

const expectThrowsAsync = async (method, errorMessage) => {
    let error = null
    try {
        await method()
    }
    catch (err) {
        error = err
    }
    expect(error).to.be.an('Error')
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage)
    }
}

describe('Strategy Fallback', () => {
    let factory;
    let adapters;

    beforeEach(() => {
        const dummyProcessClass = class {
            constructor(config) {
                this.config = config
                this.counter = 0;
            }
            async process(ip) {
                if (ip in this.config.errorIPs) {
                    throw new Error("Error");
                }
                return ip + " " + this.config.name;
            }
        }
        var instanceA = new dummyProcessClass({
            name:"A",
            errorIPs: {"123":1, "12":1}
        });
        var instanceB = new dummyProcessClass({
            name: "B",
            errorIPs: {"1234":1, "12":1}
        });

        adapters = {
            "a": instanceA,
            "b": instanceB
        };
        factory = new Factory();
    });

    it("Strategy test", async () => {
        const config = {
            path: "strategy/fallback",
            adapters: ["a","b"]
        };
        const strategy = factory.buildStrategy(config, adapters);
        // A will error out, using B as a fallback
        await strategy.process("1234").then((result) => {
            expect(result).to.equal("1234 A");
        });
        // A will error out, using B as a fallback
        await strategy.process("123").then((result) => {
            expect(result).to.equal("123 B");
        });
        // A will error out, using B as a fallback
        await strategy.process("12345").then((result) => {
            expect(result).to.equal("12345 B");
        });
        // B will error out, using A as a fallback
        await strategy.process("1234").then((result) => {
            expect(result).to.equal("1234 A");
        });

    });

    it("Strategy test", async () => {
        const config = {
            path: "strategy/fallback",
            adapters: ["a", "b"]
        };
        const strategy = factory.buildStrategy(config, adapters);

        await expectThrowsAsync(() => strategy.process("12"),"Rate limit exceeded")
    });
});