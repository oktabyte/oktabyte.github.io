/* eslint-disable scanjs-rules/call_hide */
/* eslint-disable no-magic-numbers, no-native-reassign, no-global-assign*/
/* exported setup, draw, preload, brickimg, paddleImg*/
/* global SSCD, Brick, PADDLE_WIDTH, PADDLE_HEIGHT, Player, BRICK_WIDTH, BRICK_HEIGHT*/
"use strict";

const WIDTH = 800;
const HEIGHT = 600;

const BALL_DIAMETER = 22;
const BALL_RADIUS = BALL_DIAMETER / 2;
const SPEED_UP = 0.1;
const OFFSET_X = 4;
const OFFSET_Y = 64;

let score = 0;
let lifes = 3;
let ball;
let trueSpeed;
let world;
let player;
let bricks;
let ballImg;
let brickcount;

const LEVEL_1 = {
    "bricks": 36,
    "level": [
        [true, true, true, true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true, true, true, true]
    ]
};

function preload() {
    Brick.img = loadImage("assets/img/element_blue_rectangle.png");
    Player.img = loadImage("assets/img/paddleBlu.png");
    ballImg = loadImage("assets/img/ballBlue.png");
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(255);
    reset();
    textAlign(CENTER);
}

function draw() {
    handlePhysics();

    background(0);
    if (brickcount === 0) {
        push();
        fill(255, 0, 0);
        textSize(100);
        text(`YOU WIN!!!`, WIDTH / 2, HEIGHT / 2 - 50);
        text(`Score: ${score}`, WIDTH / 2, HEIGHT / 2 + 50);
        pop();
        noLoop();

        return;
    }

    // Draw Game
    player.draw();
    image(ballImg, ball.pos.x - BALL_RADIUS, ball.pos.y - BALL_RADIUS);
    bricks.forEach((brick) => {
        brick.draw();
    });

    // Draw Score
    push();
    fill(255, 0, 0);
    textSize(30);
    text(`Score: ${score}`, 100, 50);
    text(`Lifes: ${lifes}`, 650, 50);
    pop();
}

function handlePhysics() {
    player.handleMovement();
    handleBallMovement();
    const collobj = world.pick_object(ball.collisionShape);

    if (collobj !== null) {
        handleCollisionPlayer(collobj);
        handleCollisionWalls(collobj);
        handleCollisionBricks(collobj);
    }
}

function resetBall() {
    ball = {
        "pos": new SSCD.Vector(WIDTH / 2, HEIGHT / 2),
        "collisionShape": null,
        "velo": createVector(-0.5, 1)
    };
    ball.collisionShape = new SSCD.Circle(ball.pos, BALL_RADIUS);
    trueSpeed = 5.0;
    ball.velo.normalize();
    world.add(ball.collisionShape);
}

function reset() {
    score = 0;
    lifes = 3;
    brickcount = LEVEL_1.bricks;
    Brick.resetID();
    world = new SSCD.World({"grid_size": 400});
    setupWalls();

    player = new Player(WIDTH / 2, HEIGHT - PADDLE_HEIGHT, world, WIDTH, HEIGHT);
    resetBall();
    bricks = [];
    for (let y = 0; y < LEVEL_1.level.length; y++) {
        for (let x = 0; x < LEVEL_1.level[y].length; x++) {
            if (LEVEL_1.level[y][x]) {
                bricks.push(new Brick(
                    OFFSET_X + x * (BRICK_WIDTH + 2),
                    OFFSET_Y + y * (BRICK_HEIGHT + 2),
                    world
                ));
            }
        }
    }
}


function handleBallMovement() {
    const speed = p5.Vector.mult(ball.velo, trueSpeed);
    const movX = speed.x;
    const movY = speed.y;

    ball.pos.x += movX;
    ball.pos.y += movY;
    ball.collisionShape.set_position(ball.pos);
}

function handleCollisionPlayer(collobj) {
    if (collobj.get_collision_tags() === "player") {
        let relBallX = (ball.pos.x - player.pos.x) / (PADDLE_WIDTH / 2) - 1;

        relBallX *= -1;
        const myAngle = 90 + 45 * relBallX;

        ball.velo = p5.Vector.fromAngle(radians(myAngle));
        ball.velo.y *= -1;
    }
}

function handleCollisionWalls(collobj) {
    switch (collobj.get_collision_tags()) {
    case "LEFT_WALL":
        ball.velo.x *= -1;
        trueSpeed += SPEED_UP;
        break;

    case "TOP_WALL":
        ball.velo.y *= -1;
        trueSpeed += SPEED_UP;
        break;

    case "RIGHT_WALL":
        ball.velo.x *= -1;
        trueSpeed += SPEED_UP;
        break;

    case "BOTTOM_WALL":
        lifeLost();
        break;

    default:
        break;
    }
}

function handleCollisionBricks(collobj) {
    const brick = collobj.get_collision_tags().split("_");

    if (brick[0] !== "Brick") {
        return;
    }

    const brickID = brick[1];
    const side = brick[2];

    bricks[brickID].hide(world);

    if (side === "LEFT" || side === "RIGHT") {
        ball.velo.x *= -1;
    } else {
        ball.velo.y *= -1;
    }
    trueSpeed += SPEED_UP;
    score += 5;
    brickcount -= 1;
}

function lifeLost() {
    lifes -= 1;
    world.remove(ball.collisionShape);
    if (lifes === 0) {
        reset();
    } else {
        resetBall();
    }
}

function setupWalls() {
    const leftWall = new SSCD.Rectangle(new SSCD.Vector(-10, 0), new SSCD.Vector(10, HEIGHT));
    const topWall = new SSCD.Rectangle(new SSCD.Vector(0, -10), new SSCD.Vector(WIDTH, 10));
    const rightWall = new SSCD.Rectangle(new SSCD.Vector(WIDTH, 0), new SSCD.Vector(10, HEIGHT));
    const bottomWall = new SSCD.Rectangle(new SSCD.Vector(0, HEIGHT), new SSCD.Vector(WIDTH, 10));

    world.add(leftWall);
    leftWall.set_collision_tags("LEFT_WALL");
    world.add(topWall);
    topWall.set_collision_tags("TOP_WALL");
    world.add(rightWall);
    rightWall.set_collision_tags("RIGHT_WALL");
    world.add(bottomWall);
    bottomWall.set_collision_tags("BOTTOM_WALL");
}
