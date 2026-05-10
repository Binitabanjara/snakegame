const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* Grid Size */
const box = 20;

/* Game Variables */
let snake;
let food;
let direction;
let score;
let game;

/* Start Game */
function startGame() {

    snake = [
        {
            x: 9 * box,
            y: 10 * box
        }
    ];

    food = generateFood();

    direction = "RIGHT";

    score = 0;

    document.getElementById("score").innerText = score;

    clearInterval(game);

    game = setInterval(draw, 100);
}

/* Keyboard Controls */
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {

    if (
        event.key === "ArrowLeft" &&
        direction !== "RIGHT"
    ) {
        direction = "LEFT";
    }

    else if (
        event.key === "ArrowUp" &&
        direction !== "DOWN"
    ) {
        direction = "UP";
    }

    else if (
        event.key === "ArrowRight" &&
        direction !== "LEFT"
    ) {
        direction = "RIGHT";
    }

    else if (
        event.key === "ArrowDown" &&
        direction !== "UP"
    ) {
        direction = "DOWN";
    }
}

/* Generate Food */
function generateFood() {

    return {

        x: Math.floor(Math.random() * 19) * box,

        y: Math.floor(Math.random() * 19) * box
    };
}

/* Collision Check */
function collision(head, array) {

    for (let i = 0; i < array.length; i++) {

        if (
            head.x === array[i].x &&
            head.y === array[i].y
        ) {
            return true;
        }
    }

    return false;
}

/* Rounded Rectangle */
function drawRoundedRect(x, y, width, height, radius) {

    ctx.beginPath();

    ctx.moveTo(x + radius, y);

    ctx.lineTo(x + width - radius, y);

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(x + radius, y + height);

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(x, y + radius);

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();

    ctx.fill();
}

/* Main Draw Function */
function draw() {

    /* Pink Playground */
    ctx.fillStyle = "#ffb6c1";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    /* Draw Snake */
    for (let i = 0; i < snake.length; i++) {

        /* Snake Head */
        if (i === 0) {

            ctx.fillStyle = "#00ff00";

        } else {

            /* Snake Body */
            ctx.fillStyle = "#008000";
        }

        drawRoundedRect(
            snake[i].x,
            snake[i].y,
            box,
            box,
            5
        );
    }

    /* Draw Food */
    ctx.fillStyle = "#ff0000";

    ctx.beginPath();

    ctx.arc(
        food.x + box / 2,
        food.y + box / 2,
        box / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* Snake Head Position */
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    /* Movement */
    if (direction === "LEFT") {
        snakeX -= box;
    }

    if (direction === "UP") {
        snakeY -= box;
    }

    if (direction === "RIGHT") {
        snakeX += box;
    }

    if (direction === "DOWN") {
        snakeY += box;
    }

    /* Food Eating */
    if (
        snakeX === food.x &&
        snakeY === food.y
    ) {

        score++;

        document.getElementById("score").innerText = score;

        food = generateFood();

    } else {

        snake.pop();
    }

    /* New Snake Head */
    const newHead = {

        x: snakeX,
        y: snakeY
    };

    /* Game Over Conditions */
    if (

        snakeX < 0 ||
        snakeY < 0 ||

        snakeX >= canvas.width ||
        snakeY >= canvas.height ||

        collision(newHead, snake)

    ) {

        clearInterval(game);

        saveScore();

        setTimeout(() => {

            alert(
                "Game Over!\n\nYour Score: " + score
            );

        }, 100);

        return;
    }

    /* Add Head */
    snake.unshift(newHead);
}

/* Save Score */
function saveScore() {

    const playerName =
        document.getElementById("playerName").value || "Anonymous";

    fetch('/save_score', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({

            player_name: playerName,

            score: score
        })
    })
    .then(response => response.json())
    .then(data => {

        console.log(data.message);

    })
    .catch(error => {

        console.error("Error:", error);
    });
}