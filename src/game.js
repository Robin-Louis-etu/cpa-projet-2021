import { buildLevel, level1, level2 } from "./levels.js";
import Position from "./position.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import Brick from "./brick.js";

export const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEWLEVEL: 4,
    YOUWIN: 5
};

export default class {
    constructor() {
        this.gamestate = GAMESTATE.MENU;
        this.paddle = new Paddle();
        this.ball = new Ball(new Position(this.paddle.pos.x + this.paddle.width/2, this.paddle.pos.y - 10), 8, "red", "#FF2400", new Position(0,0), this);
        this.gameObjects = [];
        this.bricks = [];
        this.levels = [level1, level2];
        this.currentLevel = 0;
    }

    start() {
        if (this.gamestate !== GAMESTATE.MENU && this.gamestate !== GAMESTATE.NEWLEVEL)
            return;
    
        this.bricks = buildLevel(this.levels[this.currentLevel]);
        this.gameObjects = [this.ball, this.paddle];
    
        this.gamestate = GAMESTATE.RUNNING;
    }

    update() {
        // if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;
    
        if (
            this.gamestate === GAMESTATE.PAUSED ||
            this.gamestate === GAMESTATE.MENU ||
            this.gamestate === GAMESTATE.GAMEOVER
        )
            return;
    
        if (this.bricks.length === 0) {
            this.currentLevel++;
            if (this.currentLevel > 1) {
                this.gamestate = GAMESTATE.YOUWIN;
            } else {
                this.gamestate = GAMESTATE.NEWLEVEL;
                this.start();
            }
        }
    
        this.gameObjects.forEach(object =>
            object.update()
        );
        this.bricks = this.bricks.filter(brick => brick.hp !== 0);
    }

    draw(ctx) {
        [...this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));
    
        if (this.gamestate === GAMESTATE.PAUSED) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();
    
        ctx.font = "30px Arial";
        ctx.fillStyle = "Black";
        ctx.textAlign = "center";
        ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
        }
    
        // if (this.gamestate === GAMESTATE.MENU) {
        // ctx.drawImage(this.bgMenu, 0, 0, this.gameWidth, this.gameHeight);
        // }
    
        // if (this.gamestate === GAMESTATE.GAMEOVER) {
        // ctx.drawImage(this.gameover, 0, 0, this.gameWidth, this.gameHeight);
        // }
        // if (this.gamestate === GAMESTATE.YOUWIN) {
        // ctx.drawImage(this.youwin, 0, 0, this.gameWidth, this.gameHeight);
        // }
    }

    togglePause() {
        if (this.gamestate === GAMESTATE.MENU) return;
        if (this.gamestate === GAMESTATE.PAUSED) {
            this.gamestate = GAMESTATE.RUNNING;
        } else {
            this.gamestate = GAMESTATE.PAUSED;
        }
    }
}