import { collisionBottomBorder, collisionLeftBorder, collisionRightBorder, collisionTopBorder } from "./collisions.js"

var friction=1;
var width = main_window.width;
var height = main_window.height;

export default class {
    constructor(p, r, c, bc, s) {
        this.pos = p;
	    this.radius = r;
        this.color = c;
        this.bordercolor = bc;
        this.speed = s;
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

    updatePosition() {
        this.pos.x += this.speed.x; 
        this.pos.y += this.speed.y;
    }

    updateFriction(){
        this.speed.x *= friction;
        this.speed.y *= friction;
    }

    updateCollisionBorder(){ 
        if (collisionLeftBorder(this)){ this.speed.x*=-1; this.pos.x=this.radius;  }
        if (collisionRightBorder(this)){ this.speed.x*=-1; this.pos.x=width-this.radius;  }
        if (collisionTopBorder(this)){ this.speed.y*=-1; this.pos.y=this.radius;  }
        if (collisionBottomBorder(this)){ this.speed.y*=-1; this.pos.y=height-this.radius;  }
        return false;
    }

    updateCollisionSameMass(ball){
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

    updateCollisionInfiniteMass(ball){
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
}