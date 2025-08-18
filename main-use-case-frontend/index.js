const URL = "http://localhost:3000";

async function consumeAPI(signal) {
    const response = await fetch(URL, { signal });

    const readerObj = response.body.pipeTo(new WritableStream({
        write(chunk) {
            console.log("chunk: ", chunk);
        }
    }));

    return readerObj;
}

let abortController = new AbortController();

(async () => {
    await consumeAPI(abortController.signal);
})();