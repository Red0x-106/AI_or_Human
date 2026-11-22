const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let waitingPlayer = null;
let games = {};

app.get("/", (req, res) => {
    res.send("AI or Human backend is running!");
});

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    // Find an opponent
    socket.on("findOpponent", () => {
        if (waitingPlayer === null) {
            waitingPlayer = socket;

            socket.emit("waiting");

            console.log("Player waiting:", socket.id);
        } else {
            const opponent = waitingPlayer;
            waitingPlayer = null;

            const gameId = opponent.id + "-" + socket.id;

            games[gameId] = {
                players: [opponent.id, socket.id],
                guesses: {},
                started: false,
                timer: null
            };

            opponent.join(gameId);
            socket.join(gameId);

            opponent.gameId = gameId;
            socket.gameId = gameId;

            console.log("Match found:", opponent.id, "<->", socket.id);

            opponent.emit("matchFound", {
                gameId: gameId
            });

            socket.emit("matchFound", {
                gameId: gameId
            });

            startGame(gameId);
        }
    });

    // Send chat message
    socket.on("sendMessage", (message) => {
        const gameId = socket.gameId;

        if (!gameId || !games[gameId]) {
            return;
        }

        io.to(gameId).emit("receiveMessage", {
            playerId: socket.id,
            message: message
        });
    });

    // Player submits AI/Human guess
    socket.on("submitGuess", (guess) => {
        const gameId = socket.gameId;

        if (!gameId || !games[gameId]) {
            return;
        }

        const game = games[gameId];

        if (!game.started) {
            return;
        }

        game.guesses[socket.id] = guess;

        console.log(
            "Guess from",
            socket.id,
            ":",
            guess
        );

        socket.emit("guessSubmitted");

        // Both players guessed
        if (Object.keys(game.guesses).length === 2) {
            finishGame(gameId);
        }
    });

    // Player leaves
    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);

        // Remove from waiting queue
        if (waitingPlayer && waitingPlayer.id === socket.id) {
            waitingPlayer = null;
        }

        const gameId = socket.gameId;

        if (gameId && games[gameId]) {
            const game = games[gameId];

            const opponentId = game.players.find(
                (playerId) => playerId !== socket.id
            );

            if (opponentId) {
                io.to(opponentId).emit("opponentDisconnected");
            }

            if (game.timer) {
                clearTimeout(game.timer);
            }

            delete games[gameId];
        }
    });
});

function startGame(gameId) {
    const game = games[gameId];

    if (!game) {
        return;
    }

    game.started = true;

    console.log("Game started:", gameId);

    io.to(gameId).emit("gameStarted", {
        duration: 90
    });

    game.timer = setTimeout(() => {
        finishGame(gameId);
    }, 90000);
}

function finishGame(gameId) {
    const game = games[gameId];

    if (!game) {
        return;
    }

    if (game.timer) {
        clearTimeout(game.timer);
    }

    game.started = false;

    const players = game.players;

    const player1 = players[0];
    const player2 = players[1];

    const guess1 = game.guesses[player1];
    const guess2 = game.guesses[player2];

    io.to(gameId).emit("gameEnded", {
        guesses: {
            [player1]: guess1 || null,
            [player2]: guess2 || null
        }
    });

    console.log("Game ended:", gameId);

    setTimeout(() => {
        if (games[gameId]) {
            delete games[gameId];
        }
    }, 5000);
}

server.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});