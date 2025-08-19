const URL = "http://localhost:3000";

async function consumeAPI(signal) {
    const response = await fetch(URL, { signal });

    const readerObj = response.body.pipeThrough(new TextDecoderStream()).pipeThrough(parseChunks())



    return readerObj;
}

function parseChunks() {
    let buffer = "";
    return new TransformStream({
        transform(chunk, ctrl) {
            buffer += chunk;

            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (const line of lines) {
                try {
                    ctrl.enqueue(JSON.parse(line));
                } catch (error) {
                    console.error("Failed to parse JSON: ", line, error);
                }
            }
        },

        flush(ctrl) {
            if(buffer.trim()) {
                try {
                    ctrl.enqueue(JSON.parse(buffer));
                } catch (error) {
                    console.error("Failed to parse JSON during flush: ", buffer, error);
                }
            }
        }
    })
}

let abortController = new AbortController();

(async () => {
   const readableStream = await consumeAPI(abortController.signal);
   readableStream.pipeTo(new WritableStream({
        write(chunk) {
            console.log("chunk: ", chunk);
            
        }
   }))
})();