import gameState from './gameState';
export var test = () => {};

// Establish connection

let ws = new WebSocket("ws://localhost:9900");
ws.onmessage = message => {
    const response = JSON.parse(message.data);
    console.log(response);
    if (response.method === "connect") {
        gameState.clientID = response.clientID;
        console.log(`Client successfully created with ID ${gameState.clientID}`);
    } else if (response.method === "create") {
        gameState.roomState = response.room;
        console.log(`Room successfully created with ID ${gameState.roomState.id}`)
    } else if (response.method === "join") {
        console.log("someones joining!")
        gameState.roomState = response.roomState;
    } else if (response.method === "update") {
        gameState.roomState = response.roomState;
    } else if (response.method === "delete") {
        gameState.roomState = null;
    } else if (response.method === "assign") {
        gameState.assignedName = response.name ?? null;
    }
    gameState.onUpdate();
}

// additional methods

export function createRoom(name) {
    gameState.isHost = true;
    gameState.name = name;
    const payload = {
        "method": "create",
        "clientID": gameState.clientID,
        "name": gameState.name
    }

    ws.send(JSON.stringify(payload));
}

export function joinRoom(roomCode, name) {
    gameState.name = name;
    const payload = {
        "method": "join",
        "clientID": gameState.clientID,
        "roomID": roomCode,
        "name": name
    }

    ws.send(JSON.stringify(payload));
}

export function leaveRoom() {
    if (gameState.roomState === null) {
        // don't need to leave an empty room
        return;
    }
    
    const payload = {
        "method": "leave",
        "clientID": gameState.clientID,
        "roomID": gameState.roomState.id
    }

    ws.send(JSON.stringify(payload));

    // cleanup
    gameState.isHost = false;
    gameState.roomState = null;
    gameState.onUpdate = () => {};
}

export function startRoom() {
    const payload = {
        "method": "start",
        "roomID": gameState.roomState.id
    }

    ws.send(JSON.stringify(payload));
}