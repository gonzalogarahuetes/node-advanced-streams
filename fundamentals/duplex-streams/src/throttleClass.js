import { Duplex } from "stream";

export class Throttle extends Duplex {
    constructor(ms) {
        super()
        this.delay = ms;
    }

    _write(chunk, encoding, callback) {
        this.push(chunk);
        setTimeout(callback(), this.ms);
    };

    _read() {}

    _final() {
        this.push(null);
    };
}