const gameArea = document.getElementById("game-area");

const player = document.getElementById("player");
const ai = document.getElementById("ai");
const escapeGate = document.getElementById("escape-gate");

const distanceText = document.getElementById("distance");
const statusText = document.getElementById("status");
const messageText = document.getElementById("message");

const gameResult = document.getElementById("game-result");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const restartButton = document.getElementById("restart-button");


let playerX = 45;
let playerY = 470;

let aiX = 120;
let aiY = 470;

let gameFinished = false;

let sprinting = false;

const playerSpeed = 3.2;
const sprintSpeed = 5;
const aiSpeed = 2.55;

const catchDistance = 25;
const gateDistance = 55;


const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};


const walls = [
    document.querySelector(".wall-one"),
    document.querySelector(".wall-two"),
    document.querySelector(".wall-three"),
    document.querySelector(".wall-four"),
    document.querySelector(".wall-five"),
    document.querySelector(".wall-six"),
    document.querySelector(".wall-seven")
];


function setPosition(element, x, y) {

    element.style.left = x + "px";
    element.style.top = y + "px";
}


function getCenter(x, y) {

    return {
        x: x + 14,
        y: y + 14
    };
}


function getDistance() {

    const playerCenter = getCenter(playerX, playerY);
    const aiCenter = getCenter(aiX, aiY);

    const x = playerCenter.x - aiCenter.x;
    const y = playerCenter.y - aiCenter.y;

    return Math.sqrt(x * x + y * y);
}


function getGateDistance() {

    const playerCenter = getCenter(playerX, playerY);

    const gateX =
        escapeGate.offsetLeft +
        escapeGate.offsetWidth / 2;

    const gateY =
        escapeGate.offsetTop +
        escapeGate.offsetHeight / 2;

    const x = playerCenter.x - gateX;
    const y = playerCenter.y - gateY;

    return Math.sqrt(x * x + y * y);
}


function isColliding(x, y) {

    const playerSize = 28;

    for (const wall of walls) {

        const wallX = wall.offsetLeft;
        const wallY = wall.offsetTop;
        const wallWidth = wall.offsetWidth;
        const wallHeight = wall.offsetHeight;

        if (
            x < wallX + wallWidth &&
            x + playerSize > wallX &&
            y < wallY + wallHeight &&
            y + playerSize > wallY
        ) {
            return true;
        }
    }

    return false;
}


function movePlayer() {

    if (gameFinished) {
        return;
    }

    let newX = playerX;
    let newY = playerY;

    const speed = sprinting
        ? sprintSpeed
        : playerSpeed;


    if (keys.up) {
        newY -= speed;
    }

    if (keys.down) {
        newY += speed;
    }

    if (keys.left) {
        newX -= speed;
    }

    if (keys.right) {
        newX += speed;
    }


    const maxX =
        gameArea.clientWidth -
        player.offsetWidth;

    const maxY =
        gameArea.clientHeight -
        player.offsetHeight;


    if (newX < 0) {
        newX = 0;
    }

    if (newX > maxX) {
        newX = maxX;
    }

    if (newY < 0) {
        newY = 0;
    }

    if (newY > maxY) {
        newY = maxY;
    }


    if (!isColliding(newX, newY)) {
        playerX = newX;
        playerY = newY;
    }


    setPosition(player, playerX, playerY);
}


function moveAI() {

    if (gameFinished) {
        return;
    }

    const playerCenter = getCenter(playerX, playerY);
    const aiCenter = getCenter(aiX, aiY);

    const differenceX =
        playerCenter.x - aiCenter.x;

    const differenceY =
        playerCenter.y - aiCenter.y;


    const distance = Math.sqrt(
        differenceX * differenceX +
        differenceY * differenceY
    );


    if (distance > 0) {

        const directionX =
            differenceX / distance;

        const directionY =
            differenceY / distance;


        let newX =
            aiX + directionX * aiSpeed;

        let newY =
            aiY + directionY * aiSpeed;


        const maxX =
            gameArea.clientWidth -
            ai.offsetWidth;

        const maxY =
            gameArea.clientHeight -
            ai.offsetHeight;


        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));


        if (!isColliding(newX, newY)) {

            aiX = newX;
            aiY = newY;

        } else {

            const sideX =
                aiX + directionX * aiSpeed;

            const sideY = aiY;


            if (
                !isColliding(sideX, sideY) &&
                sideX >= 0 &&
                sideX <= maxX
            ) {
                aiX = sideX;
            }


            const sideYMove =
                aiY + directionY * aiSpeed;


            if (
                !isColliding(aiX, sideYMove) &&
                sideYMove >= 0 &&
                sideYMove <= maxY
            ) {
                aiY = sideYMove;
            }
        }
    }


    setPosition(ai, aiX, aiY);
}


function updateDistance() {

    const distance = Math.round(getDistance());

    distanceText.textContent =
        "AI Distance: " + distance;


    if (distance < 70) {

        statusText.textContent = "AI CLOSE!";

        messageText.textContent =
            "The AI is right behind you! RUN!";

    } else if (distance < 130) {

        statusText.textContent = "RUN!";

        messageText.textContent =
            "Keep moving. The AI is getting closer.";

    } else {

        statusText.textContent = "ESCAPE";

        messageText.textContent =
            "Keep running. Find the escape gate.";

    }
}


function checkCatch() {

    if (getDistance() <= catchDistance) {

        loseGame(
            "The AI caught you before you reached the escape gate."
        );
    }
}


function checkGate() {

    if (getGateDistance() <= gateDistance) {

        winGame();
    }
}


function winGame() {

    if (gameFinished) {
        return;
    }

    gameFinished = true;

    escapeGate.classList.add("open");

    gameResult.classList.remove("hidden");

    resultTitle.textContent =
        "You Escaped";

    resultText.textContent =
        "You reached the escape gate before the AI could catch you.";
}


function loseGame(reason) {

    if (gameFinished) {
        return;
    }

    gameFinished = true;

    gameResult.classList.remove("hidden");

    resultTitle.textContent =
        "The AI Caught You";

    resultText.textContent = reason;
}


function resetGame() {

    playerX = 45;
    playerY = 470;

    aiX = 120;
    aiY = 470;

    gameFinished = false;

    sprinting = false;

    escapeGate.classList.remove("open");

    gameResult.classList.add("hidden");

    statusText.textContent = "RUN!";

    messageText.textContent =
        "Use WASD or the arrow keys to run. Hold SHIFT to sprint.";

    setPosition(player, playerX, playerY);
    setPosition(ai, aiX, aiY);
}


document.addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();


    if (
        key === "w" ||
        key === "arrowup" ||
        key === "a" ||
        key === "arrowleft" ||
        key === "s" ||
        key === "arrowdown" ||
        key === "d" ||
        key === "arrowright" ||
        key === "shift"
    ) {
        event.preventDefault();
    }


    if (key === "w" || key === "arrowup") {
        keys.up = true;
    }

    if (key === "s" || key === "arrowdown") {
        keys.down = true;
    }

    if (key === "a" || key === "arrowleft") {
        keys.left = true;
    }

    if (key === "d" || key === "arrowright") {
        keys.right = true;
    }

    if (key === "shift") {
        sprinting = true;
    }
});


document.addEventListener("keyup", (event) => {

    const key = event.key.toLowerCase();


    if (key === "w" || key === "arrowup") {
        keys.up = false;
    }

    if (key === "s" || key === "arrowdown") {
        keys.down = false;
    }

    if (key === "a" || key === "arrowleft") {
        keys.left = false;
    }

    if (key === "d" || key === "arrowright") {
        keys.right = false;
    }

    if (key === "shift") {
        sprinting = false;
    }
});


restartButton.addEventListener("click", () => {
    resetGame();
});


function gameLoop() {

    movePlayer();

    moveAI();

    updateDistance();

    checkCatch();

    checkGate();

    requestAnimationFrame(gameLoop);
}


resetGame();

gameLoop();
