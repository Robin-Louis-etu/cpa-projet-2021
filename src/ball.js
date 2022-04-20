import { BALLLIFE } from "./conf.js";
import { collisionBottomBorder, collisionLeftBorder, collisionRightBorder, collisionTopBorder, collisionBallPaddle, collisionBallBrick } from "./collisions.js"
import Position from "./position.js";
import { GAMESTATE } from "./game.js";

var width = main_window.width;
var height = main_window.height;

export default class {
    constructor(p, r, c, bc, s, game) {
        this.pos = p;
	    this.radius = r;
        this.color = c;
        this.bordercolor = bc;
        this.speed = s;
        this.life = BALLLIFE;
        this.game = game;
        this.state = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        var g = ctx.createRadialGradient(this.pos.x, this.pos.y, this.radius * 0.98, this.pos.x, this.pos.y, this.radius);
        g.addColorStop(0, this.color);
        g.addColorStop(1, this.bordercolor);
        ctx.fillStyle = g;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    }

    go() {
        if (this.game.gamestate === GAMESTATE.RUNNING && this.sate === 0) {
            this.speed = new Position(5,-7);
            this.sate = 1;
        }
    }

    update() {
        this.updateCollisionBorder();
        this.updatePosition();
        this.updateCollisionPaddle();
        this.updateCollisionBrick();
    }

    updatePosition() {
        this.pos.x += this.speed.x; 
        this.pos.y += this.speed.y;
    }

    updateFriction(){
        this.speed.x *= friction;
        this.speed.y *= friction;
    }

    updateCollisionBorder(){ 
        if (collisionLeftBorder(this)){ this.speed.x*=-1; this.pos.x=this.radius; return true; }
        if (collisionRightBorder(this)){ this.speed.x*=-1; this.pos.x=width-this.radius; return true; }
        if (collisionTopBorder(this)){ this.speed.y*=-1; this.pos.y=this.radius; return true; }
        if (collisionBottomBorder(this)){ this.speed.y*=-1; this.pos.y=height-this.radius; return true; }
        return false;
    }

    updateCollisionSameMass(ball) {
        if(collisionBalls(this, ball)){
          var x1=this.pos.x;
          var y1=this.pos.y;
          var r1=this.radius;
          var x2=ball.pos.x;
          var y2=ball.pos.y;
          var r2=ball.radius;
          var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
          var nx = (x2 - x1)/(r1+r2);
          var ny = (y2 - y1)/(r1+r2);
          var gx = -ny;
          var gy = nx;
          var v1n = nx*this.speed.x + ny*this.speed.y;
          var v1g = gx*this.speed.x + gy*this.speed.y;
          var v2n = nx*ball.speed.x + ny*ball.speed.y;
          var v2g = gx*ball.speed.x + gy*ball.speed.y;
          this.speed.x = nx*v2n +  gx*v1g;
          this.speed.y = ny*v2n +  gy*v1g;
          ball.speed.x = nx*v1n +  gx*v2g;
          ball.speed.y = ny*v1n +  gy*v2g;
     
          ball.pos.x = x1 + (r1+r2)*(x2-x1)/d;
          ball.pos.y = y1 + (r1+r2)*(y2-y1)/d;
          return true;
        }
        return false;
    }

    updateCollisionInfiniteMass(ball) {
        if(collisionBalls(this, ball)){
          var x1=ball.pos.x;
          var y1=ball.pos.y;
          var r1=ball.radius;
          var x2=this.pos.x;
          var y2=this.pos.y;
          var r2=this.radius;
          var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
          var nx = (x2 - x1)/(r1+r2);
          var ny = (y2 - y1)/(r1+r2);
          var pthis = this.speed.x*nx+this.speed.y*ny;
          this.speed.x = this.speed.x - 2*pthis*nx;
          this.speed.y = this.speed.y - 2*pthis*ny;
     
          this.pos.x = x1 + (r1+r2)*(x2-x1)/d;
          this.pos.y = y1 + (r1+r2)*(y2-y1)/d;
          return true;
        }
        return false;
    }

    updateCollisionPaddle() {
        switch (collisionBallPaddle(this, this.game.paddle)) {
            case 1:
                this.speed.x += -9;
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 2:
                // if (this.speed.x < 0) {
                //     this.speed.x = -6;
                // } else {
                //     this.speed.x += -6;
                // }
                this.speed.x += -6;
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 3:
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 4:
                // if (this.speed.x > 0) {
                //     this.speed.x = 6;
                // } else {
                //     this.speed.x += 6;
                // }
                this.speed.x += 6;
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 5:
                this.speed.x += 9;
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
          }
    }

    updateCollisionBrick() {
        this.game.bricks.forEach(brick => {
            switch (collisionBallBrick(this, brick)) {
                case 1:
                    this.speed.y *= -1;
                    this.pos.y = brick.pos.y - this.radius;
                    brick.hp--;
                    break;
                case 2:
                    this.speed.x *= -1;
                    this.pos.x = brick.pos.x - this.radius;
                    brick.hp--;
                    break;
                case 3:
                    this.speed.y *= -1;
                    this.pos.y = brick.pos.y + brick.height + this.radius;
                    brick.hp--;
                    break;
                case 4:
                    this.speed.x *= -1;
                    this.pos.x = brick.pos.x + brick.width + this.radius;
                    brick.hp--;
                    break;
            }
        });
    }
}