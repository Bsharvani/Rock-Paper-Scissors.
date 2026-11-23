from pathlib import Path
import random
from flask import Flask, render_template, request, jsonify, session

BASE_DIR = Path(__file__).resolve().parent

app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "template"),
    static_folder=str(BASE_DIR / "template" / "static"),
    static_url_path="/static",
)
app.secret_key = "rock_paper_scissors_secret"

CHOICES = ["rock", "paper", "scissors"]

PICTURES = {
    "rock": "✊",
    "paper": "✋",
    "scissors": "✌️",
}


def reset_scores() -> None:
    session["player1_score"] = 0
    session["player2_score"] = 0
    session["computer_score"] = 0
    session["draws"] = 0
    session["round"] = 0


def ensure_scores() -> None:
    required_keys = (
        "player1_score",
        "player2_score",
        "computer_score",
        "draws",
        "round",
    )
    if any(key not in session for key in required_keys):
        reset_scores()


def normalize_choice(value: object) -> str:
    return value.strip().lower() if isinstance(value, str) else ""


@app.route("/")
def home():
    reset_scores()
    return render_template("index.html")


@app.route("/play", methods=["POST"])
def play():
    ensure_scores()

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON request"}), 400

    mode = data.get("mode")
    player1 = normalize_choice(data.get("player1"))

    if player1 not in CHOICES:
        return jsonify({"error": "Invalid choice for Player 1"}), 400

    if mode == "two":
        player2 = normalize_choice(data.get("player2"))
        if player2 not in CHOICES:
            return jsonify({"error": "Invalid choice for Player 2"}), 400
        opponent_name = "Player 2"

    elif mode == "computer":
        player2 = random.choice(CHOICES)
        opponent_name = "Computer"

    else:
        return jsonify({"error": "Invalid game mode"}), 400

    session["round"] += 1

    if player1 == player2:
        result = "It's a Draw! 🤝"
        winner = "draw"
        session["draws"] += 1

    elif (
        (player1 == "rock" and player2 == "scissors")
        or (player1 == "paper" and player2 == "rock")
        or (player1 == "scissors" and player2 == "paper")
    ):
        result = "Player 1 Wins! 🎉"
        winner = "player1"
        session["player1_score"] += 1

    else:
        result = f"{opponent_name} Wins! 🏆"
        winner = "opponent"

        if mode == "two":
            session["player2_score"] += 1
        else:
            session["computer_score"] += 1

    return jsonify({
        "player1": PICTURES[player1],
        "player2": PICTURES[player2],
        "opponent_name": opponent_name,
        "result": result,
        "winner": winner,
        "player1_score": session["player1_score"],
        "player2_score": session["player2_score"],
        "computer_score": session["computer_score"],
        "draws": session["draws"],
        "round": session["round"],
    })


@app.route("/restart", methods=["POST"])
def restart():
    reset_scores()
    return jsonify({"message": "Game restarted!"})


if __name__ == "__main__":
    app.run(debug=True)
