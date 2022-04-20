var width = main_window.width;

export default class {
    constructor(p, hp) {
        this.pos = p;
        this.width = width / 10;
        this.height = 30;
        this.hp = hp;
    }

    draw(ctx) {
        ctx.beginPath();
        switch (this.hp) {
            // case 0:
            //     return;
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
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.closePath();
    }
}