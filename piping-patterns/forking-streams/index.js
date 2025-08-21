import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";

const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        const upperChunk = chunk.toString().toUpperCase();
        this.push(upperChunk);
        callback();
    }
});

const reverseTransform = new Transform({
    transform(chunk, encoding, callback) {
        const reversedChunk = chunk.toString().split("").reverse().join("");
        this.push(reversedChunk);
        callback()
    }
});

const inputStream = createReadStream("./test.txt");

inputStream.pipe(upperCaseTransform).pipe(createWriteStream("test.uppercase.txt"));
inputStream.pipe(reverseTransform).pipe(createWriteStream("test.reverse.txt"));