class CacheMiddleware {
    constructor(config) {
        this.storage = {};
    }

    apply(subject) {
        const originalProcess = subject.process;
        const obj = this;
        const override = async function (argument) {
            if (argument in obj.storage) {
                return obj.storage[argument];
            }
            const result = await originalProcess.call(subject, argument);
            obj.storage[argument] = result;
            return result;
        }

        subject.process = override;
    }
}

module.exports = {Middleware: CacheMiddleware}
