import { randomUUID } from "node:crypto";
import net from "node:net";
import { Writable } from "node:stream";

const clients = new Map();

const broadcastToClient = (senderSocketId, data) => {
    [...clients.values()]
    .filter(clientSocket => clientSocket.id !== senderSocketId)
    .forEach(clientSocket => clientSocket.write(data));
}

const broadcastStream = (socket) => {
    return new Writable({
        write(chunk, encoding, callback) {
            const data = JSON.stringify({
                id: socket.id.slice(0, 5),
                message: chunk.toString()
            })
            broadcastToClient(socket.id, data);
            callback(null, chunk);
        }
    })
}

const server = net.createServer((socket) => {
    socket.pipe(broadcastStream(socket));
});

server.listen(3000, () => "Server is listening on port 3000");

server.on("connection", (socket) => {
    socket.id = randomUUID();
    console.log(`New connection with id ${socket.id}!`);

    clients.set(socket.id, socket);

    socket.write(JSON.stringify({ id: socket.id.slice(0, 5) }));
    
    server.on("close", () => {
        console.log(`Connection ${socket.id} disconnected.`);
        clients.delete(socket.id);
    })
});
