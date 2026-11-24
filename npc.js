const player = document.getElementById("player");
const gameArea = document.getElementById("game-area");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const messageText = document.getElementById("message");

const interaction = document.getElementById("interaction");
const characterName = document.getElementById("character-name");
const characterText = document.getElementById("character-text");

const aiButton = document.getElementById("ai-button");
const humanButton = document.getElementById("human-button");

const gate = document.getElementById("gate");

const result = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const restartButton = document.getElementById("restart-button");

const npcs = [
    {
        id: "npc1",
        name: "Alex",
        text: "I usually play games after school. Sometimes I stay up way too late playing them.",
        answer: "Human",
        solved: false
    },
    {
        id: "npc2",
        name: "Sam",
        text: "I enjoy learning about new technologies because they provide many opportunities for creativity.",
        answer: "AI",
        solved: false
    },
    {
        id: "npc3",
        name: "Jordan",
        text: "My bus was late today, so I basically ran into class five minutes before the bell.",
        answer: "Human",
        solved: false
    },
    {
        id: "npc4",
        name: "Taylor",
        text: "I find conversations interesting because they allow people to exchange ideas and understand different perspectives.",
        answer: "AI",
        solved: false
    },
    {
        id: "npc5",
        name: "Riley",
        text: "I forgot my homework at home again. My teacher was not happy about it.",
        answer: "Human",
        solved: false
    }
];

let playerX = 0;
let playerY = 0;

let score = 0;
let lives = 3;

let currentNPC = null;
let gameFinished = false;

const speed = 4;

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

function setPlayerPosition() {
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}

function startPosition() {
    playerX = (gameArea.clientWidth - player.offsetWidth) / 2;
    playerY = (gameArea.clientHeight - player.offsetHeight) / 2;

    setPlayerPosition();
}

function updateInfo() {
    scoreText.textContent = "Score: " + score;
    livesText.textContent = "Lives: " + lives;
}

function getPlayerCenter() {
    return {
        x: playerX + player.offsetWidth / 2,
        y: playerY + player.offsetHeight / 2
    };
}

function getNPCPosition(npc) {
    const element = document.getElementById(npc.id);

    return {
        x: element.offsetLeft + element.offsetWidth / 2,
        y: element.offsetTop + 16
    };
}

function checkNearbyNPC() {
    if (currentNPC || gameFinished) {
        return;
    }

    const playerCenter = getPlayerCenter();

    for (const npc of npcs) {
        if (npc.solved) {
            continue;
        }

        const npcPosition = getNPCPosition(npc);

        const distance = Math.sqrt(
            Math.pow(playerCenter.x - npcPosition.x, 2) +
            Math.pow(playerCenter.y - npcPosition.y, 2)
        );

        if (distance < 60) {
            openNPC(npc);
            return;
        }
    }

    messageText.textContent =
        "Move around and get close to a character.";
}

function openNPC(npc) {
    currentNPC = npc;

    characterName.textContent = npc.name;
    characterText.textContent = npc.text;

    interaction.classList.remove("hidden");

    messageText.textContent =
        "Talk to the character and make your guess.";
}

function closeNPC() {
    interaction.classList.add("hidden");
    currentNPC = null;
}

function makeGuess(guess) {
    if (!currentNPC || gameFinished) {
        return;
    }

    const npc = currentNPC;

    if (guess === npc.answer) {
        score += 1;

        npc.solved = true;

        messageText.textContent =
            "Correct. " + npc.name + " was " + npc.answer + ".";

    } else {
        lives -= 1;

        npc.solved = true;

        messageText.textContent =
            "Wrong. " + npc.name + " was " + npc.answer + ".";
    }

    updateInfo();
    closeNPC();

    if (lives <= 0) {
        endGame(false);
        return;
    }

    checkAllSolved();
}

function checkAllSolved() {
    const allSolved = npcs.every((npc) => npc.solved);

    if (allSolved) {
        gate.classList.add("open");

        messageText.textContent =
            "You found everyone. Reach the escape gate.";
    }
}

function checkGate() {
    const allSolved = npcs.every((npc) => npc.solved);

    if (!allSolved || gameFinished) {
        return;
    }

    const gateX = gate.offsetLeft + gate.offsetWidth / 2;
    const gateY = gate.offsetTop + gate.offsetHeight / 2;

    const playerCenter = getPlayerCenter();

    const distance = Math.sqrt(
        Math.pow(playerCenter.x - gateX, 2) +
        Math.pow(playerCenter.y - gateY, 2)
    );

    if (distance < 60) {
        endGame(true);
    }
}

function endGame(won) {
    gameFinished = true;

    result.classList.remove("hidden");

    if (won) {
        resultTitle.textContent = "You Escaped";

        resultText.textContent =
            "You found the AI and escaped with a score of " +
            score +
            ".";
    } else {
        resultTitle.textContent = "Game Over";

        resultText.textContent =
            "You ran out of lives. Your score was " +
            score +
            ".";
    }
}

function resetGame() {
    score = 0;
    lives = 3;

    gameFinished = false;
    currentNPC = null;

    for (const npc of npcs) {
        npc.solved = false;
    }

    gate.classList.remove("open");

    result.classList.add("hidden");
    interaction.classList.add("hidden");

    messageText.textContent =
        "Move around and get close to a character.";

    updateInfo();
    startPosition();
}

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "w" || event.key === "arrowup") {
        keys.up = true;
    }

    if (key === "s" || event.key === "arrowdown") {
        keys.down = true;
    }

    if (key === "a" || event.key === "arrowleft") {
        keys.left = true;
    }

    if (key === "d" || event.key === "arrowright") {
        keys.right = true;
    }
});

document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (key === "w" || event.key === "arrowup") {
        keys.up = false;
    }

    if (key === "s" || event.key === "arrowdown") {
        keys.down = false;
    }

    if (key === "a" || event.key === "arrowleft") {
        keys.left = false;
    }

    if (key === "d" || event.key === "arrowright") {
        keys.right = false;
    }
});

function movePlayer() {
    if (!gameFinished && !currentNPC) {
        if (keys.up) {
            playerY -= speed;
        }

        if (keys.down) {
            playerY += speed;
        }

        if (keys.left) {
            playerX -= speed;
        }

        if (keys.right) {
            playerX += speed;
        }

        const maxX = gameArea.clientWidth - player.offsetWidth;
        const maxY = gameArea.clientHeight - player.offsetHeight;

        if (playerX < 0) {
            playerX = 0;
        }

        if (playerX > maxX) {
            playerX = maxX;
        }

        if (playerY < 0) {
            playerY = 0;
        }

        if (playerY > maxY) {
            playerY = maxY;
        }

        setPlayerPosition();

        checkNearbyNPC();
        checkGate();
    }

    requestAnimationFrame(movePlayer);
}

aiButton.addEventListener("click", () => {
    makeGuess("AI");
});

humanButton.addEventListener("click", () => {
    makeGuess("Human");
});

restartButton.addEventListener("click", () => {
    resetGame();
});

window.addEventListener("resize", startPosition);

startPosition();
updateInfo();
movePlayer();
