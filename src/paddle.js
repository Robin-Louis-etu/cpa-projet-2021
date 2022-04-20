import Position from "./position.js";

var width = main_window.width;
var height = main_window.height;

export default class {
    constructor() {
        this.width = 150;
        this.height = 20;
        this.pos = new Position(width/2 - this.width/2,height - this.height - 10);
        this.speed = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "darkcyan";
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.closePath();
    }

    updateCollisionBorder() {
        if (this.pos.x < 0) {
            this.pos.x = 0;
        }
        if (this.pos.x + this.width > width) {
            this.pos.x = width - this.width;
        }
    }
}