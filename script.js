
// Game variables
let mode = "";
let player1 = "";
let player2 = "";

let score1 = 0;
let score2 = 0;
let draws = 0;
let round = 0;

const choices = ["rock", "paper", "scissors"];

const pictures = {
    rock: "✊ Rock",
    paper: "✋ Paper",
    scissors: "✌️ Scissors"
};

// Loading Screen
window.addEventListener("load", function () {
    setTimeout(function () {
        document.getElementById("loading").style.display = "none";
        document.getElementById("game").style.display = "block";
    }, 1200);
});

// Select Game Mode
function setMode(selectedMode) {

    mode = selectedMode;

    restartGame();

    if (mode === "two") {

        document.getElementById("modeTitle").innerText =
            "👥 Player 1 vs Player 2";

        document.getElementById("opponentTitle").innerText =
            "👤 Player 2";

        document.getElementById("player2Heading").innerText =
            "👤 Player 2";

        document.getElementById("player2Instruction").innerText =
            "Choose Your Hand";

        document.getElementById("player2Buttons").style.display =
            "flex";

    } else {

        document.getElementById("modeTitle").innerText =
            "🤖 Player 1 vs Computer";

        document.getElementById("opponentTitle").innerText =
            "🤖 Computer";

        document.getElementById("player2Heading").innerText =
            "🤖 Computer";

        document.getElementById("player2Instruction").innerText =
            "Computer chooses automatically";

        document.getElementById("player2Buttons").style.display =
            "none";
    }

    document.getElementById("result").innerText =
        "Game started! Choose your hand 🎮";
}

// Player 1 Choice
function selectPlayer1(choice) {

    if (!mode) {
        alert("Please select a game mode first!");
        return;
    }

    if (player1 !== "") {
        alert("Please complete the current round first!");
        return;
    }

    player1 = choice;

    if (mode === "computer") {

        // Computer automatically selects
        player2 = choices[
            Math.floor(Math.random() * choices.length)
        ];

        playRound();

    } else {

        document.getElementById("player1Choice").innerText =
            "Player 1 has selected!";

        document.getElementById("player2Instruction").innerText =
            "Pass the device to Player 2";

        document.getElementById("result").innerText =
            "Player 2, now choose your hand!";

        // Prevent Player 1 from selecting again
        const buttons = document.querySelectorAll(
            ".player:first-of-type .choices button"
        );

        buttons.forEach(button => button.disabled = true);
    }
}

// Player 2 Choice
function selectPlayer2(choice) {

    if (mode !== "two") {
        return;
    }

    if (!player1) {
        alert("Player 1 must choose first!");
        return;
    }

    if (player2 !== "") {
        return;
    }

    player2 = choice;

    playRound();
}

// Determine Winner
function playRound() {

    round++;

    let result = "";

    if (player1 === player2) {

        result = "🤝 It's a Draw!";
        draws++;

    } else if (
        (player1 === "rock" && player2 === "scissors") ||
        (player1 === "paper" && player2 === "rock") ||
        (player1 === "scissors" && player2 === "paper")
    ) {

        result = "🎉 Player 1 Wins!";
        score1++;

    } else {

        result = mode === "computer"
            ? "🤖 Computer Wins!"
            : "🎉 Player 2 Wins!";

        score2++;
    }

    // Display Choices
    document.getElementById("player1Choice").innerText =
        "Player 1 selected: " + pictures[player1];

    document.getElementById("player2Choice").innerText =
        (mode === "computer" ? "Computer selected: " : "Player 2 selected: ")
        + pictures[player2];

    // Display Result
    document.getElementById("result").innerText = result;

    // Update Scoreboard
    document.getElementById("score1").innerText = score1;
    document.getElementById("score2").innerText = score2;
    document.getElementById("draws").innerText = draws;

    document.getElementById("round").innerText =
        "Round: " + round;

    // Reset choices for next round
    player1 = "";
    player2 = "";

    // Enable Player 1 buttons again
    document.querySelectorAll(
        ".player:first-of-type .choices button"
    ).forEach(button => button.disabled = false);

    if (mode === "two") {
        document.getElementById("player2Instruction").innerText =
            "Choose Your Hand";
    }
}

// Restart Game
function restartGame() {

    score1 = 0;
    score2 = 0;
    draws = 0;
    round = 0;

    player1 = "";
    player2 = "";

    document.getElementById("score1").innerText = "0";
    document.getElementById("score2").innerText = "0";
    document.getElementById("draws").innerText = "0";

    document.getElementById("round").innerText = "Round: 0";

    document.getElementById("player1Choice").innerText =
        "Waiting...";

    document.getElementById("player2Choice").innerText =
        "Waiting...";

    document.getElementById("result").innerText =
        mode ? "Game Restarted! 🎮" : "Select a game mode!";

    // Enable all Player 1 buttons
    document.querySelectorAll(
        ".player:first-of-type .choices button"
    ).forEach(button => button.disabled = false);

    if (mode === "two") {
        document.getElementById("player2Instruction").innerText =
            "Choose Your Hand";
    }
}
