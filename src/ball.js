import { collisionBottomBorder, collisionLeftBorder, collisionRightBorder, collisionTopBorder, collisionBallPaddle, collisionBallBrick, /*noCollisionBallPaddle,*/ collisionBalls } from "./collisions.js"
import Position from "./position.js";
import { GAMESTATE } from "./game.js";
import { BALL_RADIUS } from "./conf.js";

var width = main_window.width;

export default class {
    constructor(r, c, bc, l, game) {
	    this.radius = r;
        this.color = c;
        this.bordercolor = bc;
        this.life = l;
        this.game = game; 
        this.reset();
    }

    reset() {
        this.pos = new Position(this.game.paddle.pos.x + this.game.paddle.width/2, this.game.paddle.pos.y - 10);
        this.speed = new Position(0, 0);
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
        this.updateCollisionBorder();
        this.updatePosition();
        this.updateCollisionPaddle();
        this.updateCollisionBrick();
        // this.updateNoCollisionPaddle();
        this.updateCollisionSameMass();
    }

    updatePosition() {
        this.pos.x += this.speed.x; 
        this.pos.y += this.speed.y;
    }

    // updateFriction(){
    //     this.speed.x *= friction;
    //     this.speed.y *= friction;
    // }

    updateCollisionBorder(){ 
        if (collisionLeftBorder(this)){ this.speed.x*=-1; this.pos.x=this.radius; }
        if (collisionRightBorder(this)){ this.speed.x*=-1; this.pos.x=width-this.radius; }
        if (collisionTopBorder(this)){ this.speed.y*=-1; this.pos.y=this.radius; }
        if (collisionBottomBorder(this)){
            this.reset();
            this.life--;
        }
    }

    updateCollisionSameMass() {
        this.game.balls.forEach(ball => {
            if(this !== ball && collisionBalls(this, ball)){
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
              }
        });
    }

    updateCollisionInfiniteMass(object) {
        var x1=object.x;
        var y1=object.y;
        var r1=0;
        var x2=this.pos.x;
        var y2=this.pos.y;
        var r2=this.radius;
        var d=Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));
        var nx = (x2-x1)/(r1+r2);
        var ny = (y2-y1)/(r1+r2);
        var pthis = this.speed.x * nx + this.speed.y * ny;
        this.speed.x = - 2 * pthis * nx;
        this.speed.y = - 2 * pthis * ny;
    
        this.pos.x = x1 + (r1+r2) * (x2-x1) / d;
        this.pos.y = y1 + (r1+r2) * (y2-y1) / d;
    }

    // updateNoCollisionPaddle() {
    //     if (noCollisionBallPaddle(this, this.game.paddle)) {
    //         this.pos = new Position(this.game.paddle.pos.x + this.game.paddle.width/2, this.game.paddle.pos.y - 10);
    //         this.speed = new Position(0, 0);
    //         this.state = 0;
    //         this.life--;
    //     }
    // }

    updateCollisionPaddle() {
        switch (collisionBallPaddle(this, this.game.paddle)) {
            case 1:
                this.speed.x = -9;
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 2:
                if (this.speed.x < 0) {
                    this.speed.x = -6;
                } else {
                    this.speed.x += -6;
                }
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 3:
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 4:
                if (this.speed.x > 0) {
                    this.speed.x = 6;
                } else {
                    this.speed.x += 6;
                }
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
            case 5:
                this.speed.x = 9;
                this.speed.y *= -1;
                this.pos.y = this.game.paddle.pos.y - this.radius;
                break;
          }
    }

    updateCollisionBrick() {
        let collisionAngle = false;
        let top = false;
        let bottom = false;
        let left = false;
        let right = false;
        this.game.bricks.forEach(brick => {
            switch (collisionBallBrick(this, brick)) {
                case 1: // collision avec le haut de la brique
                    if (!top) {
                        this.speed.y *= -1;
                        this.pos.y = brick.pos.y - this.radius;
                        this.updateBrick(brick);
                    }
                    top = true;
                    break;
                case 2: // collision avec le bas de la brique
                    if (!bottom) {
                        this.speed.y *= -1;
                        this.pos.y = brick.pos.y + brick.height + this.radius;
                        this.updateBrick(brick);
                    }
                    bottom = true;
                    break;
                case 3: // collision avec le cote gauche de la brique
                    if (!left) {
                        this.speed.x *= -1;
                        this.pos.x = brick.pos.x - this.radius;
                        this.updateBrick(brick);
                    }
                    left = true;
                    break;
                case 4: // collision avec le cote droit de la brique
                    if (!right) {
                        this.speed.x *= -1;
                        this.pos.x = brick.pos.x + brick.width + this.radius;
                        this.updateBrick(brick);
                    }
                    right = true;
                    break;
                case 5: // collision avec l'angle en haut à gauche de la brique
                    if (!collisionAngle) {
                        this.updateCollisionInfiniteMass({x: brick.pos.x, y: brick.pos.y,});
                        this.updateBrick(brick);
                    }
                    collisionAngle = true;
                    break;
                case 6: // collision avec l'angle en haut à droite de la brique
                    if (!collisionAngle) {
                        this.updateCollisionInfiniteMass({x: brick.pos.x + brick.width, y: brick.pos.y});
                        this.updateBrick(brick);
                    }
                    collisionAngle = true;
                    break;
                case 7: // collision avec l'angle en bas à gauche de la brique
                    if (!collisionAngle) {
                        this.updateCollisionInfiniteMass({x: brick.pos.x, y: brick.pos.y + brick.height});
                        this.updateBrick(brick);
                    }
                    collisionAngle = true;
                    break;
                case 8: // collision avec l'angle en bas à droite de la brique
                    if (!collisionAngle) {
                        this.updateCollisionInfiniteMass({x: brick.pos.x + brick.width, y: brick.pos.y + brick.height});
                        this.updateBrick(brick);
                    }
                    collisionAngle = true;
                    break;
            }
        });
    }

    updateBrick(brick) {
        if (brick.power === 1) {
            let ball = new this.constructor(BALL_RADIUS, "red", "#FF2400", 1, this.game);
            this.game.balls.push(ball);
            ball.go(); 
        }
        brick.hp--;
    }
}