import { createWriteStream, createReadStream } from "fs";
import { PassThrough } from "stream";

import { Throttle } from "./throttleClass.js";

const readStream = createReadStream("./the-universe.mp4");
const writeStream = createWriteStream("./test.txt");

const report = new PassThrough();
const throttle = new Throttle(20);

let size = 0;
report.on('data', (chunk) => {
    size += chunk.length;
    console.log('Bytes of data so far: ', size);
})

// duplex stream: readStream --> throttleStream --> reportStream --> writeStream
readStream.pipe(throttle).pipe(report).pipe(writeStream);