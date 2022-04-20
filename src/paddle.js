import { PADDLE_BOTTOM_MARGIN, PADDLE_WIDTH, PADLLE_HEIGHT } from "./conf.js";
import Position from "./position.js";

var width = main_window.width;
var height = main_window.height;

export default class {
    constructor() {
        this.width = PADDLE_WIDTH;
        this.height = PADLLE_HEIGHT;
        this.pos = new Position(width/2 - this.width/2,height - this.height - PADDLE_BOTTOM_MARGIN);
        this.speed = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "darkcyan";
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);

        // Afficher les zones du paddle :
        // let tmp = this.width / 6;
        // ctx.strokeRect(this.pos.x, this.pos.y, tmp, this.height);
        // ctx.strokeRect(this.pos.x + tmp, this.pos.y, tmp, this.height);
        // ctx.strokeRect(this.pos.x + tmp * 2, this.pos.y, tmp * 2, this.height);
        // ctx.strokeRect(this.pos.x + tmp * 4, this.pos.y, tmp, this.height);
        // ctx.strokeRect(this.pos.x + tmp * 5, this.pos.y, tmp, this.height);

        ctx.closePath();
    }

    update() {
        if (this.pos.x < 0) {
            this.pos.x = 0;
        }
        if (this.pos.x + this.width > width) {
            this.pos.x = width - this.width;
        }
    }
}