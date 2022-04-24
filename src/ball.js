import { BALLLIFE } from "./conf.js";
import { collisionBottomBorder, collisionLeftBorder, collisionRightBorder, collisionTopBorder, collisionBallPaddle, collisionBallPoint, noCollisionBallPaddle, collisionBallBrickLeftBorder, collisionBallBrickRightBorder, collisionBallBrickTopBorder, collisionBallBrickBottomBorder } from "./collisions.js"
import Position from "./position.js";
import { GAMESTATE } from "./game.js";

var width = main_window.width;
var height = main_window.height;

var G = 0.;
var F = 1;
var P = 1.;

document.getElementById("G").oninput = e => {
    G = parseFloat(e.target.value);
}

document.getElementById("F").oninput = e => {
    F = parseFloat(e.target.value);
}

document.getElementById("P").oninput = e => {
    P = parseFloat(e.target.value);
}

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


        var x = Math.floor(this.pos.x);
        var y = Math.floor(this.pos.y);


        var collision = false;
        var angle = false;

        let c = true;

        do {
            if (c) {


                if (this.pos.x + this.speed.x >= x + 1) {
                    if (this.speed.x < 1) {
                        vx = 0;
                        x++;
                        this.pos.x += this.speed.x;
                    }
                    else {
                        vx--;
                        x++;
                        this.pos.x++;
                    }

                    if (collisionRightBorder(this)) {
                        this.speed.x *= -1;
                    }
                    else {
                        if (!this.updateCollisionBrickRight()) {
                            if (!angle) angle = angle || this.updateCollisionBrickXY();
                        }
                    }

                }
                else if (this.pos.x + this.speed.x < x) {
                    if (this.speed.x > -1) {
                        vx = 0;
                        x--;
                        this.pos.x += this.speed.x;
                    }
                    else {
                        vx--;
                        x--;
                        this.pos.x--;
                    }

                    if (collisionLeftBorder(this)) {
                        this.speed.x *= -1;
                    }
                    else {
                        if (!this.updateCollisionBrickLeft()) {
                            if (!angle) angle = angle || this.updateCollisionBrickXY();
                        }
                    }

                } else {
                    vx = 0;
                    this.pos.x += this.speed.x;
                }






                //this.updateCollisionBorder();
                //this.updatePosition();
                //this.updateCollisionPaddle();
                //this.updateCollisionBrick();

            }

            else {


                if (this.pos.y + this.speed.y >= y + 1) {
                    if (this.speed.y < 1) {
                        vy = 0;
                        y++;
                        this.pos.y += this.speed.y;
                    }
                    else {
                        vy--;
                        y++;
                        this.pos.y++;
                    }

                    if (collisionBottomBorder(this)) {
                        this.speed.y *= -1;
                    }
                    else {
                        if (!this.updateCollisionBrickBottom()) {
                            if (!angle) angle = angle || this.updateCollisionBrickXY();
                        }
                    }
                }
                else if (this.pos.y + this.speed.y < y) {
                    if (this.speed.y > -1) {
                        vy = 0;
                        y--;
                        this.pos.y += this.speed.y;
                    }
                    else {
                        vy--;
                        y--;
                        this.pos.y--;
                    }

                    if (collisionTopBorder(this)) {
                        this.speed.y *= -1;
                    }
                    else {
                        if (!this.updateCollisionBrickTop()) {
                            if (!angle) angle = angle || this.updateCollisionBrickXY();
                        }
                    }

                } else {
                    vy = 0;
                    this.pos.y += this.speed.y;

                }





                //this.updateCollisionBorder();
                //this.updatePosition();
                //this.updateCollisionPaddle();
                //this.updateCollisionBrick();

            };

            c = !c;
        } while (vx > 0 || vy > 0)
        //if (!collision) this.updateCollisionBrickXY();

        //this.updateCollisionBrick();
        this.updateCollisionPaddle();

        this.speed.y *= F;
        this.speed.y += G;
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
        var x2 = this.pos.x;
        var y2 = this.pos.y;
        var r2 = Math.sqrt(Math.pow(this.pos.x - x, 2) + Math.pow(this.pos.y - y, 2));

        var vx = this.speed.x;
        var vy = this.speed.y;

        this.speed.x -= 2 * (vx * (x2 - x1) * (x2 - x1) + vy * (y2 - y1) * (x2 - x1)) / (r2 * r2);
        this.speed.y -= 2 * (vx * (x2 - x1) * (y2 - y1) + vy * (y2 - y1) * (y2 - y1)) / (r2 * r2);

        console.log(vx * vx + vy * vy - this.speed.x * this.speed.x - this.speed.y * this.speed.y);

        //if (this.speed.x > 0) this.pos.x += 2;
        //if (this.speed.x < 0) this.pos.x -= 2;
        //if (this.speed.y > 0) this.pos.y += 2;
        //if (this.speed.y < 0) this.pos.y -= 2;

        console.log("ANGLE");


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
                this.speed.y *= -1;

                if (Math.abs(this.speed.y) < 5) this.speed.y *= P;
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

                if (Math.abs(this.speed.y) < 5) this.speed.y *= P;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 3:
                this.speed.y *= -1;

                if (Math.abs(this.speed.y) < 5) this.speed.y *= P;
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

                if (Math.abs(this.speed.y) < 5) this.speed.y *= P;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 5:
                this.speed.x += 9;
                this.speed.y *= -1;
                if (Math.abs(this.speed.y) < 5) this.speed.y *= P;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
          }
    }

    updateCollisionBrickRight() {
        var x = Math.floor(this.pos.x + this.radius) + 1;
        var y = Math.round(this.pos.y);

        if (this.game.matrix[x] && this.game.matrix[x][y]) {
            for (var brick of this.game.matrix[x][y]) {
                if (brick.hp > 0 && collisionBallBrickRightBorder(this, brick)) {
                    this.speed.x *= -1;
                    //brick.hp--;
                    return true;
                }
            }
        }

        return false;
    }

    updateCollisionBrickLeft() {
        var x = Math.floor(this.pos.x - this.radius) - 1;
        var y = Math.round(this.pos.y);

        if (this.game.matrix[x] && this.game.matrix[x][y]) {
            for (var brick of this.game.matrix[x][y]) {
                if (brick.hp > 0 && collisionBallBrickLeftBorder(this, brick)) {
                    this.speed.x *= -1;
                    //brick.hp--;
                    return true;
                }
            }
        }

        return false;
    }

    updateCollisionBrickTop() {
        var x = Math.round(this.pos.x);
        var y = Math.floor(this.pos.y - this.radius) - 1;

        if (this.game.matrix[x] && this.game.matrix[x][y]) {
            for (var brick of this.game.matrix[x][y]) {
                if (brick.hp > 0 && collisionBallBrickTopBorder(this, brick)) {
                    this.speed.y *= -1;
                    //brick.hp--;
                    return true;
                }
            }
        }

        return false;
    }

    updateCollisionBrickBottom() {
        var x = Math.round(this.pos.x);
        var y = Math.floor(this.pos.y + this.radius) + 1;

        if (this.game.matrix[x] && this.game.matrix[x][y]) {
            for (var brick of this.game.matrix[x][y]) {
                if (brick.hp > 0 && collisionBallBrickBottomBorder(this, brick)) {
                    this.speed.y *= -1;
                    //brick.hp--;
                    return true;
                }
            }
        }

        return false;
    }

    updateCollisionBrickXY() {
        let bottomOfBall = Math.floor(this.pos.y + this.radius) + 1;
        let topOfBall = Math.floor(this.pos.y - this.radius) - 1;
        let leftSideOfBall = Math.floor(this.pos.x - this.radius) - 1;
        let rightSideOfBall = Math.floor(this.pos.x + this.radius) + 1;

        for (var x = leftSideOfBall; x < rightSideOfBall; ++x) {
            for (var y = topOfBall; y < bottomOfBall; ++y) {
                if (this.game.matrix[x] && this.game.matrix[x][y])
                    for (var brick of this.game.matrix[x][y]) {
                        if (brick.hp > 0) {
                            let topOfBrick = brick.pos.y;
                            let leftSideOfBrick = brick.pos.x;
                            let rightSideOfBrick = brick.pos.x + brick.width;
                            let bottomOfBrick = brick.pos.y + brick.height;

                            if (collisionBallPoint(this, leftSideOfBrick, topOfBrick)) {
                                return this.updateCollisionPointInfiniteMass(leftSideOfBrick, topOfBrick);
                            } else if (collisionBallPoint(this, rightSideOfBrick, topOfBrick)) {
                                return this.updateCollisionPointInfiniteMass(rightSideOfBrick, topOfBrick);
                            } else if (collisionBallPoint(this, leftSideOfBrick, bottomOfBrick)) {
                                return this.updateCollisionPointInfiniteMass(leftSideOfBrick, bottomOfBrick);
                            } else if (collisionBallPoint(this, rightSideOfBrick, bottomOfBrick)) {
                                return this.updateCollisionPointInfiniteMass(rightSideOfBrick, bottomOfBrick);
                            }
                        }
                    }
            }
        }
        return false;
    }

}