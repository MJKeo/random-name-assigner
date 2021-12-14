const http = require("http");
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9900, () => console.log("listening.. on 9900"));

// clients hashmap
const clients = {};
const rooms = {};

const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on("request", (request) => {
    // connect
    const connection = request.accept(null, request.origin);
    const clientID = guid();
    clients[clientID] = {
        "connection": connection,
        "name": null
    };
    const payload = {
        "method": "connect",
        "clientID": clientID
    };
    // additional methods
    connection.on("open", () => console.log("Connection has opened"));
    /* TO DO: ADD IN CLEANUP HERE */
    connection.on("close", () => {
        disconnectClient(clientID);
        console.log("Connection has closed FOR " + clientID)
    });
    connection.on("message", (message) => {
        // just received a message from the client
        const result = JSON.parse(message.utf8Data);

        if (result.method === "create") {
            // user wants to create a new room
            console.log("Creating a game...");
            const clientID = result.clientID;
            var roomID = code(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            // ensure it's a unique room code
            while (rooms[roomID] !== undefined) {
                roomID = code(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            }
            // create the room
            rooms[roomID] = {
                "id": roomID,
                "clients": [{
                    "clientID": clientID,
                    "name": result.name
                }],
                "hostID": clientID
            };
            // save name
            clients[clientID].name = result.name;
            // send response
            const payload = {
                "method": "create",
                "room": rooms[roomID]
            };
            // printStatus()
            clients[clientID].connection.send(JSON.stringify(payload));
        } 
        else if (result.method === "join") {
            console.log("Joining a game...")
            // get values
            const clientID = result.clientID;
            const roomID = result.roomID;
            const room = rooms[roomID];
            // save name
            /* TO DO: VERIFY NAME IS UNIQUE */
            clients[clientID].name = result.name;
            // add client to room
            room.clients.push({
                "clientID": clientID,
                "name": result.name
            })
            // update each client with the new state
            const payload = {
                "method": "join",
                "roomState": room
            };
            room.clients.forEach(client => {
                clients[client.clientID].connection.send(JSON.stringify(payload));
            });
        }
        else if (result.method === "leave") {
            removeClientFromRoom(result.clientID, rooms[result.roomID]);
        }
        else if (result.method === "start") {
            // randomly assign someone a differen't person's name
            const room = rooms[result.roomID];
            let assignments = assignNames(room.clients.length);
            // send out an update to everyone
            Object.keys(assignments).forEach(index => {
                const client = room.clients[index];
                const assignedClient = room.clients[assignments[index]];
                const payload = {
                    "method": "assign",
                    "name": assignedClient.name
                };
                clients[client.clientID].connection.send(JSON.stringify(payload));
            })
        }
        printStatus()
    });
    connection.send(JSON.stringify(payload));
})

function removeClientFromRoom(clientID, room) {
    if (room === null || room === undefined) {
        // no need to remove if the room is already gone
        return;
    }

    for (var i = 0; i < room.clients.length; i++) {
        const client = room.clients[i];
        if (client.clientID === clientID) {
            // remove them from the room
            room.clients.splice(i, 1);
            // delete room if they are the host, otherwise send an update to everyone
            if (room.hostID === clientID) {
                const payload = {
                    "method": "delete"
                };
                room.clients.forEach(client => {
                    clients[client.clientID].connection.send(JSON.stringify(payload));
                })
                delete rooms[room.id];
            } else {
                const payload = {
                    "method": "update",
                    "roomState": room
                };
                room.clients.forEach(client => {
                    clients[client.clientID].connection.send(JSON.stringify(payload));
                });
            }
            return;
        }
    }
}

function disconnectClient(clientID) {
    // remove from clients list
    delete clients[clientID];
    // remove from room
    Object.keys(rooms).forEach(roomID => {
        const room = rooms[roomID]
        removeClientFromRoom(clientID, room);
    });
}

// ========================
// ==== Helper Methods ====
// ========================

function printStatus() {
    console.log("");
    console.log("Status:");
    console.log("=====================");
    console.log("Clients:")
    console.log(clients);
    console.log("+++++++++++++++++++++");
    console.log("Rooms:")
    console.log(rooms);
    console.log("=====================");
}

function assignNames(numParticipants) {
    var leftToAssign = Array.from(Array(numParticipants).keys());
    var leftToPick = Array.from(Array(numParticipants).keys());
    const assignments = {};
    // make assignments
    while (leftToAssign.length > 2) {
        // pick a random number to start with
        let toAssignIndex = Math.floor(Math.random() * leftToAssign.length);
        // pick a random number
        var toPickIndex = Math.floor(Math.random() * leftToPick.length);
        while (leftToPick[toPickIndex] === leftToAssign[toAssignIndex]) {
            toPickIndex = Math.floor(Math.random() * leftToPick.length);
        }
        // save the pick
        assignments[leftToAssign[toAssignIndex]] = leftToPick[toPickIndex];
        // remove the options we just used
        leftToAssign.splice(toAssignIndex, 1);
        leftToPick.splice(toPickIndex, 1);
    }
    // now handle the last 2. We don't want to have someone be left only with their own name
    const first = leftToAssign[0];
    const second = leftToAssign[1];
    if (leftToPick.includes(first)) {
        if (leftToPick[0] === first) {
            assignments[first] = leftToPick[1];
            assignments[second] = leftToPick[0];
        } else {
            assignments[first] = leftToPick[0];
            assignments[second] = leftToPick[1];
        }
    } else if (leftToPick.includes(second)) {
        if (leftToPick[0] === second) {
            assignments[first] = leftToPick[0];
            assignments[second] = leftToPick[1];
        } else {
            assignments[first] = leftToPick[1];
            assignments[second] = leftToPick[0];
        }
    } else {
        let index = Math.floor(Math.random() * 2);
        assignments[leftToAssign[0]] = leftToPick[index];
        leftToPick.splice(index, 1);
        assignments[leftToAssign[1]] = leftToPick[0];
    }
    
    return assignments;
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

function code(length, chars) {
    var result = '';
    for (var i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();