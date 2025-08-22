import { connect } from "node:net";
import { Readable } from "node:stream";

function createNumberStream() {
    let count = 0;
    return new Readable({
        objectMode: true,
        read() {
            if(count < 5) {
                this.push(count);
                count++;
            } else {
                this.push(null);
            }
        }
    })
}

function createStringsStream() {
    const messages = ["hello", "world!", "this", "is", "advanced", "nodejs"];
    let index = 0;

    return new Readable({
        objectMode: true,
        read() {
            if(index < messages.length) {
                this.push(messages[index]);
                index++;
            } else {
                this.push(null);
            }
        }
    })
}

function multiplexStreams(streams, destination) {
    let activeStreams = streams.length;

    streams.forEach((stream, index) => {
        stream.on("data", (chunk) => {
            const dataBuffer = Buffer.from(chunk.toString());
            const header = Buffer.alloc(5);

            header.writeUint8(index, 0);
            header.writeUint32BE(dataBuffer.length, 1);

            destination.write(Buffer.concat([header, dataBuffer]));
            console.log(`Data sent on channel: ${index}: ${chunk};`);
        })

        stream.on("end", () => {
            activeStreams--;
            if(activeStreams === 0) {
                destination.end();
                console.log("All streams ended. Connection closed.");
            }
        })
    });
}

const socket = connect(3000, "localhost", () => {
    console.log("Connected to server");
    const numberStream = createNumberStream();
    const stringStream = createStringsStream();

    multiplexStreams([numberStream, stringStream], socket);
});

socket.on("error", (error) => {
    console.error("Socket error: ", error);
})