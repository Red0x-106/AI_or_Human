const imagePairs = [
    ["A.png", "A2.jpg"],
    ["B.jpg", "B2.jpg"],
    ["C.jpg", "C2.jpg"],
    ["D.jpg", "D2.jpg"],
    ["E.jpg", "E2.jpg"],
    ["F.jpg", "F2.jpg"],
    ["G.jpg", "G2.jpg"],
    ["H.jpg", "H2.jpg"],
    ["I.jpg", "I2.jpg"],
    ["J.jpg", "J2.jpg"],
    ["K.jpg", "K2.jpg"],
    ["L.jpg", "L2.jpg"],
    ["M.jpg", "M2.jpg"],
    ["N.jpg", "N2.jpg"],
    ["O.jpg", "O2.jpg"],
    ["P.jpg", "P2.jpg"],
    ["Q.jpg", "Q2.jpg"],
    ["R.jpg", "R2.jpg"],
    ["S.jpg", "S2.jpg"],
    ["T.jpg", "T2.jpg"],
    ["U.jpg", "U2.jpg"],
    ["V.jpg", "V2.jpg"],
    ["W.jpg", "W2.jpg"],
    ["X.jpg", "X2.jpg"],
    ["Y.jpg", "Y2.jpg"],
    ["Z.jpg", "Z2.jpg"]
];


const image1 = document.getElementById("image-1");
const image2 = document.getElementById("image-2");

const choice1 = document.getElementById("choice-1");
const choice2 = document.getElementById("choice-2");

const scoreText = document.getElementById("score");
const roundText = document.getElementById("round");
const resultText = document.getElementById("result");
const nextButton = document.getElementById("next-btn");

const highScoreText = document.getElementById("high-score");


let currentRound = 0;
let score = 0;

let highScore =
    Number(localStorage.getItem("highScore")) || 0;

let aiSide = 0;
let answered = false;


function showNextButton() {

    nextButton.style.setProperty(
        "display",
        "block",
        "important"
    );

}


function hideNextButton() {

    nextButton.style.setProperty(
        "display",
        "none",
        "important"
    );

}


function loadRound() {

    answered = false;

    hideNextButton();

    resultText.textContent = "";

    choice1.classList.remove(
        "selected",
        "wrong"
    );

    choice2.classList.remove(
        "selected",
        "wrong"
    );


    const pair = imagePairs[currentRound];

    const aiImage = pair[0];
    const humanImage = pair[1];


    if (currentRound % 2 === 0) {

        image1.src =
            "images/" + aiImage;

        image2.src =
            "images/" + humanImage;

        aiSide = 1;

    } else {

        image1.src =
            "images/" + humanImage;

        image2.src =
            "images/" + aiImage;

        aiSide = 2;

    }


    roundText.textContent =
        currentRound + 1;

    scoreText.textContent =
        score;


    if (highScoreText) {

        highScoreText.textContent =
            highScore;

    }

}


function checkAnswer(selectedSide) {

    if (answered) {
        return;
    }


    answered = true;


    if (selectedSide === aiSide) {

        score++;

        resultText.textContent =
            "Correct! That was AI.";


        if (selectedSide === 1) {

            choice1.classList.add(
                "selected"
            );

        } else {

            choice2.classList.add(
                "selected"
            );

        }


        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "highScore",
                highScore
            );


            if (highScoreText) {

                highScoreText.textContent =
                    highScore;

            }

        }

    } else {

        resultText.textContent =
            "Wrong! That was not AI.";


        if (selectedSide === 1) {

            choice1.classList.add(
                "wrong"
            );

        } else {

            choice2.classList.add(
                "wrong"
            );

        }


        if (aiSide === 1) {

            choice1.classList.add(
                "selected"
            );

        } else {

            choice2.classList.add(
                "selected"
            );

        }

    }


    scoreText.textContent =
        score;


    showNextButton();

}


choice1.addEventListener(
    "click",
    function() {

        checkAnswer(1);

    }
);


choice2.addEventListener(
    "click",
    function() {

        checkAnswer(2);

    }
);


nextButton.addEventListener(
    "click",
    function() {

        if (!answered) {
            return;
        }


        if (
            currentRound ===
            imagePairs.length - 1
        ) {

            resultText.textContent =
                "Game over! Your score: " +
                score +
                "/" +
                imagePairs.length;

            hideNextButton();

            return;

        }


        currentRound++;

        loadRound();

    }
);


loadRound();