import { createReadStream, createWriteStream } from "node:fs";
import { Readable, Transform } from "node:stream";

function myTransform(firstFile, resultStream) {
    return new Transform({
        transform(filename, encoding, callback) {
            const src = createReadStream(filename, { encoding: "utf-8" });

            src.on("data", (chunk) => {
                const lines = chunk.split("\n");

                lines.forEach((line, index) => {
                    // skip the names of the columns for all files but the first one
                    if(index === 0 && !firstFile) return;

                    if(line.trim()) {
                        resultStream.write(line + '\n');
                    }
                })
            })

            src.on("end", (chunk) => {
                firstFile = false;
                // next line is done() callback
                callback();
            })

            src.on("error", callback);
        },
        objectMode: true,
    })
}

function concatCSVFiles(resultFile, csvFiles) {
    return new Promise((resolves, rejects) => {
        const resultStream = createWriteStream(resultFile);

        let firstFile = true;

        Readable.from(csvFiles)
        .pipe(myTransform(firstFile, resultStream))
        .on("error", rejects)
        .on("finish", () => {
            resultStream.end();
            resolves();
        })
    })
}

concatCSVFiles("./result.csv", ["./f1.csv", "./f2.csv", "./f3.csv"])
    .then(() => console.log("CSV files merged successfully!"))
    .catch(() => console.error("Error merging files: ", error));