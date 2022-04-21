import { BALLLIFE } from "./conf.js";
import { collisionBottomBorder, collisionLeftBorder, collisionRightBorder, collisionTopBorder, collisionBallPaddle, collisionBallBrick, noCollisionBallPaddle } from "./collisions.js"
import Position from "./position.js";
import { GAMESTATE } from "./game.js";

var width = main_window.width;
var height = main_window.height;

const G = 0.;
const F = 1;
const P = -1;

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
        if (this.game.gamestate === GAMESTATE.RUNNING && this.state === 0) {
            this.speed = new Position(5,-7);
            this.state = 1;
        }
    }

    update() {
        var vx = Math.abs(this.speed.x);
        var vy = Math.abs(this.speed.y);


        var x = Math.abs(this.pos.x);
        var y = Math.abs(this.pos.y);


        var collision = false;

        do {


            if (this.pos.x + this.speed.x >= x + 1) {
                vx--;
                x++;
                this.pos.x++;
            }
            else if (this.pos.x + this.speed.x <= x - 1) {
                vx--;
                x--;
                this.pos.x--;
            } else {
                vx = 0;
                this.pos.x += this.speed.x;
            }


            if (collisionLeftBorder(this)) { this.speed.x *= -1; /*this.pos.x=this.radius; return true;*/ }
            if (collisionRightBorder(this)) { this.speed.x *= -1; /*this.pos.x=width-this.radius; return true;*/ }

            collision = collision || this.updateCollisionBrickX()

            if (!collision) this.updateCollisionBrickXY();


            //this.updateCollisionBorder();
            //this.updatePosition();
            //this.updateCollisionPaddle();
            //this.updateCollisionBrick();

        } while(vx > 0);

        do {

                if (this.pos.y + this.speed.y >= y + 1) {
                    vy--;
                    y++;
                    this.pos.y++;
                }
                else if (this.pos.y + this.speed.y <= y - 1) {
                    vy--;
                    y--;
                    this.pos.y--;
                } else {
                    vy = 0;
                    this.pos.y += this.speed.y;
                }

            if (collisionTopBorder(this)) { this.speed.y *= -1; /*this.pos.y=this.radius; return true;*/ }
            if (collisionBottomBorder(this)) { this.speed.y *= -1; /*this.pos.y=height-this.radius; return true;*/ }

            collision = collision || this.updateCollisionBrickY()

            if (!collision) this.updateCollisionBrickXY();


            //this.updateCollisionBorder();
            //this.updatePosition();
            //this.updateCollisionPaddle();
            //this.updateCollisionBrick();

        } while (vy > 0);

        //if (!collision) this.updateCollisionBrickXY();

        //this.updateCollisionBrick();
        this.updateCollisionPaddle();

        this.speed.y += G;
        this.speed.y *= F;
        this.speed.x *= F;
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
        if (collisionLeftBorder(this)){ this.speed.x*=-1; /*this.pos.x=this.radius; return true;*/ }
        if (collisionRightBorder(this)){ this.speed.x*=-1; /*this.pos.x=width-this.radius; return true;*/ }
        if (collisionTopBorder(this)){ this.speed.y*=-1; /*this.pos.y=this.radius; return true;*/ }
        if (collisionBottomBorder(this)){ this.speed.y*=-1; /*this.pos.y=height-this.radius; return true;*/ }
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

    updateCollisionPointInfiniteMass(x, y) {
        var x1 = x;
        var y1 = y;
        var r1 = 0;
        var x2 = this.pos.x;
        var y2 = this.pos.y;
        var r2 = this.radius;
        var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

        //this.speed.x *= -1;
        //this.speed.y *= -1;
        //return;

        console.log("x1 " + this.speed.x);
        console.log("y1 " + this.speed.y);


        var nx = (x2 - x1) / (r1 + r2);
        var ny = (y2 - y1) / (r1 + r2);
        var pthis = this.speed.x * nx + this.speed.y * ny;
        this.speed.x = this.speed.x - 2 *pthis * nx;
        this.speed.y = this.speed.y - 2 * pthis * ny;

        //this.pos.x = x1 + (r1 + r2) * (x2 - x1) / d;
        //this.pos.y = y1 + (r1 + r2) * (y2 - y1) / d;

        this.updatePosition();

        //var nx = ((x2 - x1) / (r1 + r2));
        //var ny = ((y2 - y1) / (r1 + r2));
        //var pthis = (this.speed.x * ((x2 - x1) / (r1 + r2)) + this.speed.y * ((y2 - y1) / (r1 + r2)));

        //this.speed.x = this.speed.x - 2 * pthis * ((x2 - x1) / (r1 + r2));
        //this.speed.y = this.speed.y - 2 * pthis * ((y2 - y1) / (r1 + r2));

        //this.speed.x = this.speed.x - 2 * ((this.speed.x * (x2 - x1) + this.speed.y * (y2 - y1)) * (x2 - x1)) / ((r1 + r2) * (r1 + r2));
        //this.speed.y = this.speed.y - 2 * ((this.speed.x * (x2 - x1) + this.speed.y * (y2 - y1)) * (y2 - y1)) / ((r1 + r2) * (r1 + r2));


        console.log("x2 " + this.speed.x);
        console.log("y2 " + this.speed.y);


        return true;
    }

    updateNoCollisionPaddle() {
        if (noCollisionBallPaddle(this, this.game.paddle)) {
            this.life--;
            this.pos = new Position(this.paddle.pos.x + this.paddle.width/2, this.paddle.pos.y - 10);
        }
    }

    updateCollisionPaddle() {
        switch (collisionBallPaddle(this, this.game.paddle)) {
            case 1:
                this.speed.x += -9;
                this.speed.y *= P;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 2:
                // if (this.speed.x < 0) {
                //     this.speed.x = -6;
                // } else {
                //     this.speed.x += -6;
                // }
                this.speed.x += -6;
                this.speed.y *= P;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 3:
                this.speed.y *= P;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 4:
                // if (this.speed.x > 0) {
                //     this.speed.x = 6;
                // } else {
                //     this.speed.x += 6;
                // }
                this.speed.x += 6;
                this.speed.y *= P;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 5:
                this.speed.x += 9;
                this.speed.y *= P;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
          }
    }

    updateCollisionBrick() {
        var top = false;
        var bottom = false;
        var left = false;
        var right = false;
        this.game.bricks.forEach(brick => {
            let topOfBrick = brick.pos.y;
            let leftSideOfBrick = brick.pos.x;
            let rightSideOfBrick = brick.pos.x + brick.width;
            let bottomOfBrick = brick.pos.y + brick.height;
            switch (collisionBallBrick(this, brick)) {
                case 5:
                    if (!left && !top) this.updateCollisionPointInfiniteMass(leftSideOfBrick, topOfBrick);
                    left = true;
                    top = true;
                    brick.hp--;
                    break;
                case 6:
                    if (!right && !top) this.updateCollisionPointInfiniteMass(rightSideOfBrick, topOfBrick);
                    right = true;
                    top = true;
                    brick.hp--;
                    break;
                case 7:
                    if (!left && !bottom) this.updateCollisionPointInfiniteMass(leftSideOfBrick, bottomOfBrick);
                    left = true;
                    bottom = true;
                    brick.hp--;
                    break;
                case 8:
                    if (!right && !bottom) this.updateCollisionPointInfiniteMass(rightSideOfBrick, bottomOfBrick);
                    right = true;
                    bottom = true;
                    brick.hp--;
                    break;
                case 1:
                    //if (top) this.speed.y = 0;
                    if (!bottom) this.speed.y *= -1;
                    bottom = true;
                    //this.pos.y = brick.pos.y - this.radius;
                    brick.hp--;
                    break;
                case 2:
                    //if (right) this.speed.x = 0;
                    if (!left) this.speed.x *= -1;
                    left = true;
                    //this.pos.x = brick.pos.x - this.radius;
                    brick.hp--;
                    break;
                case 3:
                    //if (bottom) this.speed.y = 0;
                    if (!top) this.speed.y *= -1;
                    top = true;
                    //this.pos.y = brick.pos.y + brick.height + this.radius;
                    brick.hp--;
                    break;
                case 4:
                    //if (left) this.speed.x = 0;
                    if (!right) this.speed.x *= -1;
                    right = true;
                    //this.pos.x = brick.pos.x + brick.width + this.radius;
                    brick.hp--;
                    break;
            }
        });
    }

    updateCollisionBrickX() {
        var top = false;
        var bottom = false;
        var left = false;
        var right = false;
        this.game.bricks.forEach(brick => {
            let topOfBrick = brick.pos.y;
            let leftSideOfBrick = brick.pos.x;
            let rightSideOfBrick = brick.pos.x + brick.width;
            let bottomOfBrick = brick.pos.y + brick.height;
            switch (collisionBallBrick(this, brick)) {
                case 2:
                    //if (right) this.speed.x = 0;
                    if (!left) this.speed.x *= -1;
                    left = true;
                    //this.pos.x = brick.pos.x - this.radius;
                    brick.hp--;
                    break;
                case 4:
                    //if (left) this.speed.x = 0;
                    if (!right) this.speed.x *= -1;
                    right = true;
                    //this.pos.x = brick.pos.x + brick.width + this.radius;
                    brick.hp--;
                    break;
            }
        });

        return left || right || bottom || top;
    }


    updateCollisionBrickY() {
        var top = false;
        var bottom = false;
        var left = false;
        var right = false;
        this.game.bricks.forEach(brick => {
            let topOfBrick = brick.pos.y;
            let leftSideOfBrick = brick.pos.x;
            let rightSideOfBrick = brick.pos.x + brick.width;
            let bottomOfBrick = brick.pos.y + brick.height;
            switch (collisionBallBrick(this, brick)) {
                case 1:
                    //if (top) this.speed.y = 0;
                    if (!bottom) this.speed.y *= -1;
                    bottom = true;
                    //this.pos.y = brick.pos.y - this.radius;
                    brick.hp--;
                    break;
                case 3:
                    //if (bottom) this.speed.y = 0;
                    if (!top) this.speed.y *= -1;
                    top = true;
                    //this.pos.y = brick.pos.y + brick.height + this.radius;
                    brick.hp--;
                    break;
            }
        });

        return left || right || bottom || top;
    }

    updateCollisionBrickXY() {
        var top = false;
        var bottom = false;
        var left = false;
        var right = false;
        this.game.bricks.forEach(brick => {
            let topOfBrick = brick.pos.y;
            let leftSideOfBrick = brick.pos.x;
            let rightSideOfBrick = brick.pos.x + brick.width;
            let bottomOfBrick = brick.pos.y + brick.height;
            switch (collisionBallBrick(this, brick)) {
                case 5:
                    if (!left && !top) this.updateCollisionPointInfiniteMass(leftSideOfBrick, topOfBrick);
                    left = true;
                    top = true;
                    brick.hp--;
                    break;
                case 6:
                    if (!right && !top) this.updateCollisionPointInfiniteMass(rightSideOfBrick, topOfBrick);
                    right = true;
                    top = true;
                    brick.hp--;
                    break;
                case 7:
                    if (!left && !bottom) this.updateCollisionPointInfiniteMass(leftSideOfBrick, bottomOfBrick);
                    left = true;
                    bottom = true;
                    brick.hp--;
                    break;
                case 8:
                    if (!right && !bottom) this.updateCollisionPointInfiniteMass(rightSideOfBrick, bottomOfBrick);
                    right = true;
                    bottom = true;
                    brick.hp--;
                    break;
            }
        });

        return left || right || bottom || top;
    }

}