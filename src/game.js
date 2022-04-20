import Position from "./position.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import Brick from "./brick.js";

var ctx = main_window.getContext('2d');
var width = main_window.width;
var height = main_window.height;
var friction = 1;

// ------ GAME CONFIGURATION ------
const paddle = new Paddle();
const ball = new Ball(new Position(paddle.pos.x + paddle.width/2, paddle.pos.y - 10), 8, "red", "#FF2400", new Position(7,-2));
var bricks = [
    new Brick(new Position(0, 0), 1),
    new Brick(new Position(50, 40), 2),
    new Brick(new Position(100, 100), 3),
]

onmousemove = event => {
    paddle.pos.x = event.clientX - paddle.width/2 - 10;
    ball.pos.x = paddle.pos.x + paddle.width/2;
};

// ------------------------------

function draw() {
    paddle.draw(ctx);
    ball.draw(ctx);
    for(var element of bricks) {
        element.draw(ctx);
    }
}

function update() {
    paddle.updateCollisionBorder();
    ball.updateCollisionBorder();
    // ball.updatePosition();
}

function loop() {
    ctx.clearRect(0, 0, width, height);
    update();
    draw();

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);