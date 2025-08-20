import { pipeline } from "node:stream";
import { createWriteStream, createReadStream } from "node:fs";
import split from "split";
import parallelTransform from "parallel-transform";

const PARALLELISM = 2;

pipeline(
    createReadStream("./movies.csv"),
    split(),
    parallelTransform(PARALLELISM, async (line, done) => {
        if(!line.trim()) {
            return done();
        }

        try {
            const [title, ratingStr, posterPath] = line.split(",");
            const rating = parseFloat(ratingStr);

            if(rating > 5) {
                done(null, `Title: ${title}, Rating: ${rating}, Poster: ${posterPath}\n`);
            } else {
                done();
            }
        } catch (error) {
            console.error(`Error processing line ${line}`, error);
        }
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