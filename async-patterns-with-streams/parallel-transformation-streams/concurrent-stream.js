import { Transform } from "node:stream";

export class ConcurrentStream extends Transform {
    constructor(processChunk, options = {}) {
        super({ objectMode: true, ...options });
        this.processChunk = processChunk;
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

        callback();
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

        if(this.activeTasks === 0 && this.finalizeCallback) {
            this.finalizeCallback();
        }
    }
}