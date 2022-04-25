import { buildLevel, level1, level2 } from "./levels.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import { PLAYER_LIFE, BALL_RADIUS } from "./conf.js";
import Position from "./position.js";

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
        this.levels = [level2, level1];
        this.currentLevel = 0;
        this.life = PLAYER_LIFE;
    }

    start() {
        this.matrix = new Array(width);

        for (var x = 0; x < width; ++x) {
            this.matrix[x] = new Array(height);
            for (var y = 0; y < height; ++y) { 
                this.matrix[x][y] = [];
            }
        }

        this.bricks = buildLevel(this.levels[this.currentLevel]);
        this.balls = [new Ball(new Position(this.paddle.pos.x + this.paddle.width/2, this.paddle.pos.y - BALL_RADIUS), BALL_RADIUS, "red", "#FF2400", this)];
        
        this.bricks.forEach(brick => {
            for (var i = brick.pos.x; i < brick.pos.x + brick.width; ++i) {
                for (var j = brick.pos.y; j < brick.pos.y + brick.height; ++j) {
                    this.matrix[i][j].push(brick);
                }
            }
        });
    }

    reset() {
        if (this.gamestate === GAMESTATE.GAMEOVER || this.gamestate === GAMESTATE.YOUWIN || this.gamestate === GAMESTATE.PAUSED) {    
            this.gamestate = GAMESTATE.RUNNING;
            this.paddle.reset();
            this.currentLevel = 0;
            this.life = PLAYER_LIFE;

            this.start();
        }
    }

    update() {
        if (this.gamestate === GAMESTATE.RUNNING) {
            [...this.balls, this.paddle].forEach(object => object.update());

            this.balls = this.balls.filter(ball => !ball.lost);
            this.bricks = this.bricks.filter(brick => brick.hp > 0);

            if (this.balls.length === 0) {
                this.life--;
                if (this.life > 0) {
                    this.balls = [new Ball(new Position(this.paddle.pos.x + this.paddle.width/2, this.paddle.pos.y - BALL_RADIUS), BALL_RADIUS, "red", "#FF2400", this)];
                } else {
                    this.gamestate = GAMESTATE.GAMEOVER;
                }
            }
            
            if (this.bricks.length === 0) {
                this.currentLevel++;
                if (this.currentLevel > 1) {
                    this.gamestate = GAMESTATE.YOUWIN;
                } else {
                    this.start();
                }
            }
        }
    }

    draw(ctx) {
        const hp = document.querySelector("#health_points");
        hp.innerHTML = `Lives : ${this.life}`;

        [...this.balls, this.paddle, ...this.bricks].forEach(object => object.draw(ctx));

        if (this.gamestate === GAMESTATE.PAUSED) {
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();
    
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Paused", width / 2, height / 2);
        ctx.font = "15px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("(Press escape to continue)", width / 2, height / 2 + 30);
        ctx.font = "15px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("(Press enter to restart)", width / 2, height / 2 + 60);
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