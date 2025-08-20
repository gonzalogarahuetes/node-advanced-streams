import { Transform } from "node:stream";

export class ConcurrentStream extends Transform {
    constructor(concurrencyLimit = 10, processChunk, options = {}) {
        super({ objectMode: true, ...options });
        this.limit = concurrencyLimit;
        this.processChunk = processChunk;
        this.queuedTasks = []
        this.activeTasks = 0;
        this.finalizeCallback = null;
    }

    _transform(chunk, encoding, callback) {
        this.activeTasks++;
        this.processChunk(
            chunk,
            encoding,
            this.push.bind(this),
            this._taskComplete.bind(this),
        );

        if(this.activeTasks < this.limit) {
            callback();
        } else {
            this.queuedTasks.push(callback);
        }
    }

    _flush(callback) {
        if(this.activeTasks > 0) {
            this.finalizeCallback = callback;
        } else {
            callback();
        }
    }

    _taskComplete(error) {
        this.activeTasks --;
        if(error) {
            return this.emit("error", error);
        }

        if(this.activeTasks >= this.limit) {
            const firstCallback = this.queuedTasks.shift();
            firstCallback();
        }

        if(this.activeTasks === 0 && this.finalizeCallback) {
            this.finalizeCallback();
        }
    }
}