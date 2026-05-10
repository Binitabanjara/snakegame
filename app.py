from flask import Flask, render_template, request, jsonify
from datetime import datetime

from database import init_db, save_score, get_top_scores

app = Flask(__name__)

init_db()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/leaderboard')
def leaderboard():
    scores = get_top_scores()
    return render_template('leaderboard.html', scores=scores)

@app.route('/save_score', methods=['POST'])
def save_game_score():
    data = request.json

    player_name = data['player_name']
    score = data['score']

    save_score(
        player_name,
        score,
        str(datetime.now())
    )

    return jsonify({
        "message": "Score saved successfully"
    })

if __name__ == '__main__':
    app.run(debug=True)