import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { setInterval } from "node:timers/promises";


async function* myReadable(abortController) {
    // send a tic ✅ every 300 ms
    for await (const interval of setInterval(300)) {
        // if(abortController.signal.aborted) break;
        yield Buffer.from("✅");
    }
}

async function* myWritable(stream) {
    for await (const chunk of stream) {
        console.log(`writable: ${chunk.toString()}`);
    }
}

const abortController = new AbortController()

abortController.signal.onabort = () => {
    console.log("The process was aborted.");  
};

// abort after one sec
setTimeout(() => {
    abortController.abort();
}, 1000);

try {
    await pipeline(Readable.from(myReadable()), myWritable, { signal: abortController.signal });
} catch (error) {
    if(error.code !== "ABORT_ERR") throw error;
}

