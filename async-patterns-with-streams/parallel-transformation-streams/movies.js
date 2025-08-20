import { pipeline } from "node:stream";
import { createWriteStream, createReadStream } from "node:fs";
import { ConcurrentStream } from "./concurrent-stream.js";
import split from "split";

pipeline(
    createReadStream("./movies.csv"),
    split(),
    new ConcurrentStream(async (line, encoding, push, done) => {
        if(!line.trim()) {
            return done();
        }

        try {
            const [title, ratingStr, posterPath] = line.split(",");
            const rating = parseFloat(ratingStr);

            if(rating > 5) {
                push(`Title: ${title}, Rating: ${rating}, Poster: ${posterPath}\n`);
            }
        } catch (error) {
            console.error(`Error processing line ${line}`, error);
        }

        done();
    }),
    createWriteStream("./filtered-movies.txt"),
    (err) => {
        if(err) {
            console.error("Pipeline failed: ", err);
            process.exit(1);
        }
        console.log("All movies have been processed.");
    }
)