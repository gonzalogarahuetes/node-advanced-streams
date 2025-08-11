import { Transform } from "stream";

class ChangeText extends Transform {
    constructor(char) {
        super()
        this.replaceChar = char;
    }

    _transform(chunk, encoding, callback) {
        const transformedChunk = chunk.toString().replace(/[a-z]|[A-Z]|[0-9]/g, this.replaceChar);
        this.push(transformedChunk);
        callback();
    }

    _flush(callback) {
        // execute when the stream of data has finished
        this.push("more data is passed...")
        callback()
    }
}

var smileStream = new ChangeText("😄");

process.stdin.pipe(smileStream).pipe(process.stdout);