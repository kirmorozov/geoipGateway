
class FirstStrategy {
    constructor(config, adapters) {
        this.currentAdapter = 0;
        this.adapters = adapters;
    }

    async process(ip) {
        return this.adapters[this.currentAdapter].process(ip);
    };

}
module.exports = {Strategy: FirstStrategy}