import { createServer } from "node:net";
import { Writable } from "node:stream";

function demultiplexStream(source, destinations) {
    let currentChannel = null;
    let currentLength = null;

    source.on("readable", () => {
        let chunk;
        while(true) {
            if(!currentChannel) {
                chunk = source.read(1);
                if(!chunk) break;

                currentChannel = chunk.readUInt8(0);
            }

            if(!currentLength) {
                chunk = source.read(4);
                if(!chunk) break;

                currentLength = chunk.readUInt32BE(0);
            }

            chunk = source.read(currentLength);
            console.log(`We saved data on channel ${currentChannel}: ${chunk.toString()}`);

            currentChannel = null;
            currentLength = null;
        }

        source.on("end", () => {
            destinations.forEach(des => des.end());
            console.log("Connection closed.");
        })
    })
}

const numberStream = new Writable({
    write(chunk, encoding, callback) {
        const number = parseInt(chunk.toString());
        console.log(`Number received: ${number}`);
        callback();
    }
});

const stringStream = new Writable({
    write(chunk, encoding, callback) {
        const message = chunk.toString();
        console.log(`String received: ${message}`);
        callback();
    }
})

const server = createServer((socket) => {
    console.log("A client joined.");
    
    demultiplexStream(socket, [numberStream, stringStream]);

    socket.on("error", (error) => {
        console.error("Socket error: ", error);
    })
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});