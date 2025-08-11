import { createWriteStream } from "fs";

const writeStream = createWriteStream("./test.txt");

// we usually don't need to handle backpressure or highwatermark manually
process.stdin.pipe(writeStream);