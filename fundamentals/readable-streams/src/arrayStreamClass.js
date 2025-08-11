import { Readable } from "stream";

export class ArrayStreamClass extends Readable {
    constructor(array) {
        // if not specified, encoding is binary by default and returns the Buffers
        // super({ encoding: "utf-8" }); // This will return the strings instead
        super({ objectMode: true });
        this.array = array;
        this.index = 0;
    }

    _read() {
        if(this.index <= this.array.length) {
            // const chunk = this.array[this.index]; // This for the strings response
            const chunk = {
                data: this.array[this.index],
                index: this.index
            }
            this.push(chunk);
            this.index += 1;
        } else {
            this.push(null);
        }
    }
}