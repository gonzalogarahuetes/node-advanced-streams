import { createWriteStream, createReadStream } from "fs";
import { PassThrough } from "stream";

const readStream = createReadStream("./the-universe.mp4");
const writeStream = createWriteStream("./test.txt");

const reportStream = new PassThrough();

let size = 0;
reportStream.on('data', (chunk) => {
    size += chunk.length;
    console.log('Bytes of data so far: ', size);
})

// duplex stream: readStream --> reportStream --> writeStream
readStream.pipe(reportStream).pipe(writeStream);