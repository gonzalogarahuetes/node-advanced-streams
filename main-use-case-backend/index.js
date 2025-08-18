import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { Readable } from "node:stream";
import csvtojson from "csvtojson";
import { Transform } from "node:stream";

const PORT = 3000;

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
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

    Readable.toWeb(createReadStream("./imd_movies.csv"))
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(createTransformStream())
    .pipeTo(createWritableWebStream(res));
}

createServer(handleRequest).listen(PORT, () => console.log(`Backend is listening on port ${PORT}`));