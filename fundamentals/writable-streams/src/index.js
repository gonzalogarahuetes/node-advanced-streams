import { createReadStream, createWriteStream } from "fs";

const readStream = createReadStream("./the-universe.mp4");
const writeStream = createWriteStream("./copy_the-universe.mp4");

readStream.on("data", (chunk) => {
    writeStream.write(chunk);
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