import { createReadStream, createWriteStream, write } from "fs";

const readStream = createReadStream("./the-universe.mp4");
// add highwatermark
const writeStream = createWriteStream("./copy_the-universe.mp4", {
    // random number of bytes in this case. Default is quite small so it pauses several times
    highWaterMark: 162922
});

readStream.on("data", (chunk) => {
    const res = writeStream.write(chunk);
    if(!res) {
        // we have backpressure
        console.log("backpressure");
        readStream.pause();
    }
})

writeStream.on('drain', () => {
    console.log('drained');
    readStream.resume();
})

readStream.on("end", (chunk) => {
    writeStream.end()
})

readStream.on("error", (error) => {
    console.error(error);
})

writeStream.on("close", () => {
    process.stdout.write("file copied.\n")
})