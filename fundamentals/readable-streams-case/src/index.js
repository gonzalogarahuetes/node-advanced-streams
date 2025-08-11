import fs from "fs";

const readStream = fs.createReadStream("./the-universe.mp4");

readStream.on("data", (chunk) => {
    console.log(`reading a chunk\n`, chunk);
})

readStream.on("end", (chunk) => {
    console.log('stream finished.');
})

readStream.on("error", (error) => {
    console.error(error);
})

// convert readStream in a non-flowing mode so that it asks for the next chunk
// instead of reading automatically until the end
readStream.pause();

process.stdin.on("data", (chunk) => {
    const text = chunk.toString().trim();
    console.log(`echo: ${text}`);
})