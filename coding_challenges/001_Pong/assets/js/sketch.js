/* eslint-disable no-magic-numbers */
/* exported setup, draw*/
"use strict";

const WIDTH = 800;
const HEIGHT = 600;
const PADDEL_HEIGHT = 120;
const PADDEL_WIDTH = 20;
const PADDEL_SPEED = 5;
const BALL_DIAMETER = 20;
const BALL_RADIUS = BALL_DIAMETER / 2;
const SPEED_UP = 0.75;

let paddelSpieler;
let paddelAI;
let ball;
let trueSpeed;
let pointsPlayer = 0;
let pointsAI = 0;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(255);

    paddelSpieler = {
        "x": 0,
        "y": HEIGHT / 2
    };

    paddelAI = {
        "x": WIDTH - PADDEL_WIDTH,
        "y": HEIGHT / 2
    };

    reset();

    angleMode(DEGREES);
}

function draw() {
    handlePhysics();

    background(0);

    fill(255);
    noStroke();

    // Draw Game

    rect(paddelSpieler.x, paddelSpieler.y, PADDEL_WIDTH, PADDEL_HEIGHT);
    rect(paddelAI.x, paddelAI.y, PADDEL_WIDTH, PADDEL_HEIGHT);
    circle(ball.x, ball.y, BALL_DIAMETER);

    // Draw Score

    textSize(50);
    textAlign(CENTER);
    text(pointsPlayer, 350, 100);
    text(":", 400, 100);
    text(pointsAI, 450, 100);
}

function handlePhysics() {
    handlePlayerMovement();
    handleAIMovement();
    handleBallMovement();
    handleCollisionPlayer();
    handleCollisionAI();
}

function reset() {
    ball = {
        "x": WIDTH / 2,
        "y": HEIGHT / 2,
        "velo": createVector(-1, -0.75)
    };
    trueSpeed = 3.0;
}

function handlePlayerMovement() {
    if (keyIsPressed === true) {
        if (keyCode === UP_ARROW) {
            paddelSpieler.y -= PADDEL_SPEED;
            if (paddelSpieler.y < 0) {
                paddelSpieler.y = 0;
            }
        } else if (keyCode === DOWN_ARROW) {
            paddelSpieler.y += PADDEL_SPEED;
            if (paddelSpieler.y > HEIGHT - PADDEL_HEIGHT) {
                paddelSpieler.y = HEIGHT - PADDEL_HEIGHT;
            }
        }
    }
}

function handleAIMovement() {
    const aiCenter = paddelAI.y + PADDEL_HEIGHT / 2;
    let aiMove;

    if (ball.y - aiCenter > 0) {
        aiMove = min(PADDEL_SPEED, ball.y - aiCenter);
    } else {
        aiMove = max(-PADDEL_SPEED, ball.y - aiCenter);
    }
    paddelAI.y = constrain(paddelAI.y + aiMove, 0, HEIGHT - PADDEL_HEIGHT);
}

function handleBallMovement() {
    const speed = p5.Vector.mult(ball.velo, trueSpeed);
    const movX = speed.x;
    const movY = speed.y;

    ball.x += movX;
    ball.y += movY;

    if (ball.y - BALL_RADIUS <= 0) {
        ball.velo.y *= -1.0;
        trueSpeed += SPEED_UP;
    }

    if (ball.y + BALL_RADIUS >= HEIGHT) {
        ball.velo.y *= -1.0;
        trueSpeed += SPEED_UP;
    }
}

function handleCollisionPlayer() {
    if (ball.x < 30 && ball.y > paddelSpieler.y && ball.y < paddelSpieler.y + PADDEL_HEIGHT) {
        ball.velo = p5.Vector.fromAngle(-(45 - (ball.y - paddelSpieler.y) / (PADDEL_HEIGHT / 2)));
        trueSpeed += SPEED_UP;
    }

    if (ball.x < BALL_RADIUS) {
        pointsAI += 1;
        reset();
    }
}

function handleCollisionAI() {
    const paddleX = WIDTH - PADDEL_WIDTH - BALL_RADIUS;

    if (ball.x > paddleX && ball.y > paddelAI.y && ball.y < paddelAI.y + PADDEL_HEIGHT) {
        ball.velo = p5.Vector.fromAngle(-90 - (ball.y - paddelAI.y) / (PADDEL_HEIGHT / 2));
        trueSpeed += SPEED_UP;
    }

    if (ball.x > WIDTH - BALL_RADIUS) {
        pointsPlayer += 1;
        reset();
    }
}
