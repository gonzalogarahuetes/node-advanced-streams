import { Readable } from "node:stream";
import { ReadableStream, WritableStream, TransformStream } from "node:stream/web";
import { setInterval, setTimeout } from "node:timers/promises";

// the generator function creates a readable node stream, not a web stream
async function* myReadable() {
    yield Buffer.from("first msg");
    await setTimeout(300);
    yield Buffer.from("first msg");
}

// this transforms node stream into web stream
const readable = Readable.toWeb(Readable.from(myReadable()));

// This creates a readable web stream, not a node stream
// const readable = new ReadableStream({
//     async start(controller) {
//         let counter = 0;
//         for await (const i of setInterval(300)) {
//             controller.enqueue(`Message number ${counter}`);
//             counter++;
//         }
//     }
// })

const writable = new WritableStream({
    async write(chunk) {
        console.log(`The chunk is ${chunk}`);
    }
})

const transformer = new TransformStream({
    transform(chunk, controller) {
        const newChunk = `${chunk} 😍`;
        controller.enqueue(newChunk);
    }
})

readable.pipeThrough(transformer).pipeTo(writable);