import net from "node:net";
import { Writable } from "node:stream";

function log(msg) {
    process.stdout.write(`\r${msg}`);
}

const myWritable = new Writable({
    write(chunk, encoding, callback) {
        const { id, message } = JSON.parse(chunk);

        if(message) {
            log(`${id} says: ${message}`);
        } else {
            log(`My ID: ${id}\n`);
        }

        log(`Type something: `);

        callback(null, chunk);
    }
})

process.stdin.pipe(net.connect(3000)).pipe(myWritable);