import sqlite3
import os

BASE_DIR = os.path.dirname(__file__)
INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')

os.makedirs(INSTANCE_DIR, exist_ok=True)

DB_PATH = os.path.join(INSTANCE_DIR, 'games.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()

    conn.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            date TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

def save_score(player_name, score, date):
    conn = get_db()

    conn.execute(
        'INSERT INTO scores (player_name, score, date) VALUES (?, ?, ?)',
        (player_name, score, date)
    )

    conn.commit()
    conn.close()

def get_top_scores():
    conn = get_db()

    rows = conn.execute('''
        SELECT player_name, score, date
        FROM scores
        ORDER BY score DESC
        LIMIT 10
    ''').fetchall()

    conn.close()

    return [dict(row) for row in rows]