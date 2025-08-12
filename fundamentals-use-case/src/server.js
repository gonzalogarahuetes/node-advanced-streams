import { randomUUID } from "node:crypto";
import net from "node:net";

const clients = new Map();

const server = net.createServer((socket) => {
    socket.pipe(socket);
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
