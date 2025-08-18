import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { Readable, Transform } from "node:stream";
import { WritableStream, TransformStream } from "node:stream/web";
import csvtojson from "csvtojson";

const PORT = 3000;

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
}

function createAbortController(req) {
    const abortController = new AbortController();
    req.once("close", () => {
        console.log("Client disconnected, aborting stream...");
        abortController.abort()
    })
    return abortController;
}

function createTransformStream() {
    return new TransformStream({
        transform(chunk, ctrl) {
            try {
                const rawData = JSON.parse(Buffer.from(chunk));

                const selectedFields = JSON.stringify({
                    title: rawData.title,
                    vote: rawData.vote_average,
                    poster: rawData.poster_path
                })

                console.log(selectedFields);
                
                ctrl.enqueue(selectedFields.concat("\n"));
            } catch (error) {
                console.log("Error processing chunk: ", error);
            }
        }
    })
}

function createWritableWebStream(res) {
    return new WritableStream({
        write(chunk) {
            res.write(chunk);
        },
        close() {
            res.end()
        }
    })
}

async function handleRequest(req, res) {
    if(req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    const abortController = createAbortController(req)

    try {
        res.writeHead(200, headers);
        await Readable.toWeb(createReadStream("./imd_movies.csv"))
          .pipeThrough(Transform.toWeb(csvtojson()))
          .pipeThrough(createTransformStream())
          .pipeTo(createWritableWebStream(res), { signal: abortController.signal });
    } catch (error) {
        if(error.name !== "AbortError") {
            console.log("Unexpected error", error);
            res.statusCode = 500;
            res.end("Internal Server Error")
        }
    }

}

createServer(handleRequest).listen(PORT, () => console.log(`Backend is listening on port ${PORT}`));