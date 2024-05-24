
class Queue {
    constructor() {
        this.tail = undefined;
        this.head = undefined;
        this.size = 0;
    }

    add(value) {
        const link = {value, next: undefined};
        if (this.size === 0) {
            this.tail = link;
            this.head = link;
        } else {
            this.tail.next = link;
            this.tail = this.tail.next;
        }
        this.size++;
    }

    pop() {
        if (this.size > 0) {
            const value = this.head.value;
            this.head = this.head.next;
            this.size--;
            return value;
        }
    }

    peek() {
        if (this.size > 0) {
            return this.head.value
        }
    }
}
class LimitMiddleware {
    constructor(config) {
        this.config = config;
        this.queue = new Queue();
    }

    apply(subject) {
        const originalProcess = subject.process;
        const obj = this;

        const override = async function(argument) {
            const nowTime = Math.floor(Date.now()/1000);
            const threshold = nowTime - obj.config.term;
            while (obj.queue.size > 0 && obj.queue.peek() < threshold) {
                obj.queue.pop();
            }
            if (obj.queue.size >= obj.config.limit) {
                throw new Error(`Rate limit exceeded (${obj.config.limit} calls per ${obj.config.term} seconds)`)
            }

            obj.queue.add(nowTime);
            return originalProcess.call(subject, argument);
        }

        subject.process = override;
    }
}

module.exports = {Middleware: LimitMiddleware}
