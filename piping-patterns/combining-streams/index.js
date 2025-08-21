import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { createCombinedStream } from "./combined-streams.js";

/*
        1. Parse data from CSV ----> Stream 1
        2. Filter data         ----> Stream 2
        3. Transform data      ----> Stream 3
*/

pipeline(
    createReadStream("./data.csv"),
    createCombinedStream({ minAge: 30 }),
    createWriteStream("./result.csv"),
    (err) => {
        if(err) {
            console.error("Pipeline failed: ", err);
            process.exit(1);
        }
        console.log("Pipeline succeeded!");
    }
)