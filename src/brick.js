import { BRICK_HEIGHT, BRICK_WIDTH } from "./conf.js";

export default class {
    constructor(p, hp, pw) {
        this.pos = p;
        this.width = BRICK_WIDTH;
        this.height = BRICK_HEIGHT;
        this.hp = hp;
        this.power = pw;
    }

    draw(ctx) {
        ctx.beginPath();
        
        switch (this.power) {
            case 0: // brique normale
                switch (this.hp) {
                    case 1:
                        ctx.fillStyle = "orange";
                        break;
                
                    case 2:
                        ctx.fillStyle = "blue";
                        break;
                    
                    case 3:
                        ctx.fillStyle = "pink";
                        break;
                }
                break;
            case 1: // brique spéciale : fait apparaître une balle supplémentaire
                ctx.fillStyle = "red";
                break;
        }
        
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.closePath();
    }
}