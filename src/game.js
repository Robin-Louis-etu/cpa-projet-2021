import { buildLevel, level1, level2 } from "./levels.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import { BALL_LIFE, BALL_RADIUS } from "./conf.js";

var width = main_window.width;
var height = main_window.height;

export const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    GAMEOVER: 2,
    YOUWIN: 3
};

export default class {
    constructor() {
        this.gamestate = GAMESTATE.RUNNING;
        this.paddle = new Paddle();
        this.balls = [];
        this.bricks = [];
        this.levels = [level1, level2];
        this.currentLevel = 0;

        this.matrix = new Array(width);

        for (var x = 0; x < width; ++x) {
            this.matrix[x] = new Array(height);
            for (var y = 0; y < height; ++y) {
                this.matrix[x][y] = [];
            }
        }

    }

    start() {
        this.bricks = buildLevel(this.levels[this.currentLevel]);
        this.balls = [new Ball(BALL_RADIUS, "red", "#FF2400", BALL_LIFE, this)];
        this.bricks.forEach(brick => {
            for (var x = brick.pos.x; x < brick.pos.x + brick.width; ++x) {
                for (var y = brick.pos.y; y < brick.pos.y + brick.height; ++y) {
                    this.matrix[x][y].push(brick);
                }
            }
        });
    }

    reset() {
        if (this.gamestate === GAMESTATE.GAMEOVER || this.gamestate === GAMESTATE.YOUWIN) {    
            this.gamestate = GAMESTATE.RUNNING;
            this.paddle.reset();
            this.currentLevel = 0;

            this.start();
        }
    }

    update() {
        if (this.gamestate === GAMESTATE.PAUSED || this.gamestate === GAMESTATE.GAMEOVER || this.gamestate === GAMESTATE.YOUWIN)
             return;
    
        if (this.bricks.length === 0) {
            this.currentLevel++;
            if (this.currentLevel > 1) {
                this.gamestate = GAMESTATE.YOUWIN;
            } else {
                this.start();
            }
        }
        
        [...this.balls, this.paddle].forEach(object => object.update());
        
        this.bricks = this.bricks.filter(brick => brick.hp > 0);
        this.balls = this.balls.filter(ball => ball.life > 0);

        if (!this.balls.length) this.gamestate = GAMESTATE.GAMEOVER;
    }

    draw(ctx) {
        [...this.balls, this.paddle, ...this.bricks].forEach(object => object.draw(ctx));
    
        if (this.gamestate === GAMESTATE.PAUSED) {
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();
    
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Paused", width / 2, height / 2);
        }
    
        if (this.gamestate === GAMESTATE.GAMEOVER) {
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", width / 2, height / 2);
            ctx.font = "15px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("(Press enter to restart)", width / 2, height / 2 + 30);
        }

        if (this.gamestate === GAMESTATE.YOUWIN) {
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("You Win !", width / 2, height / 2);
            ctx.font = "15px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("(Press enter to restart)", width / 2, height / 2 + 30);
        }
    }

    togglePause() {
        if (this.gamestate === GAMESTATE.PAUSED) {
            this.gamestate = GAMESTATE.RUNNING;
        } else if (this.gamestate === GAMESTATE.RUNNING) {
            this.gamestate = GAMESTATE.PAUSED;
        }
    }
}