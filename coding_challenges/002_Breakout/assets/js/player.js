/* global SSCD */
/* exported Player */
"use strict";

const PADDLE_HEIGHT = 24;
const PADDLE_WIDTH = 104;
const PADDLE_SPEED = 5;

class Player {
    constructor(posx, posy, world, WORLD_WIDTH, WORLD_HEIGHT) {
        this.WORLD_WIDTH = WORLD_WIDTH;
        this.WORLD_HEIGHT = WORLD_HEIGHT;
        this.pos = new SSCD.Vector(posx, posy);
        this.size = new SSCD.Vector(PADDLE_WIDTH, PADDLE_HEIGHT);
        this.collisionShape = new SSCD.Rectangle(this.pos, this.size);
        world.add(this.collisionShape);
        this.collisionShape.set_collision_tags("player");
    }

    draw() {
        image(Player.img, this.pos.x, this.pos.y);
    }

    move(x, y) {
        this.pos.x = constrain(x, 0, this.WORLD_WIDTH - PADDLE_WIDTH);
        this.pos.y = constrain(y, 0, this.WORLD_HEIGHT);
        this.collisionShape.set_position(this.pos);
    }

    moveBy(x, y) {
        this.move(this.pos.x + x, this.pos.y + y);
    }

    handleMovement() {
        if (keyIsPressed === true) {
            if (keyCode === LEFT_ARROW) {
                this.moveBy(-PADDLE_SPEED, 0);
            } else if (keyCode === RIGHT_ARROW) {
                this.moveBy(PADDLE_SPEED, 0);
            }
        }
    }
}

Player.prototype.img = null;
