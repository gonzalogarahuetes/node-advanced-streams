import { Transform } from "node:stream";

export function createJSONTransformerStream() {
    return new Transform({
        writableObjectMode: true,
        readableObjectMode: true,
        transform(record, encoding, callback) {
            const jsonString = JSON.stringify(record).concat("\n");
            this.push(jsonString);

            callback();
        }
    })
}