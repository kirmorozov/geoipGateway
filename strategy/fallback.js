
class FallbackStrategy {
    constructor(config, adapters) {
        this.currentAdapter = 0;
        this.adapters = adapters;
        this.config = config;
    }

    async process(ip) {
        const startAdapter = this.currentAdapter;
        var canProcess = true;
        while(canProcess) {
            try {
                return await this.adapters[this.config.adapters[this.currentAdapter]].process(ip);
            } catch (e) {
                console.log(e);
                this.currentAdapter += 1;
                this.currentAdapter = this.currentAdapter % this.config.adapters.length;
                if (startAdapter == this.currentAdapter) {
                    canProcess = false;
                }
            }
        }

        throw new Error("Rate limit exceeded");
    };

}
module.exports = {Strategy: FallbackStrategy}