import { createReadStream, createWriteStream } from "node:fs";
import split from "split";

const destinationFile = "merged.csv";
const sources = ["f1.csv", "f2.csv"];

const destStream = createWriteStream(destinationFile);

let headerWritten = false;
let endCount = 0;

for (const file of sources) {
    const sourceStream = createReadStream(file, { encoding: "utf-8" });
    let isFirstLine = true;

    sourceStream.on("end", () => {
        if(++endCount === sources.length) {
            destStream.end();
            console.log(`${destinationFile} created`);
        }
    });

    // The `end` flag set to true avoids the destination stream to close when any input stream finishes
    sourceStream.pipe(split((line) => {
        if(isFirstLine) {
            isFirstLine = false;
            if(!headerWritten) {
                headerWritten = true;
                return line + "\n";
            } else {
                return;
            }
        } else {
            return line + "\n";
        }
    })).pipe(destStream, { end: false });
}