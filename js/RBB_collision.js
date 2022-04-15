/* ******************************************************
 * CPA - Conception et pratique de l'algorithmique.
 * Copyright (C) 2014 <Binh-Minh.Bui-Xuan@ens-lyon.org>.
 * GPL version>=3 <http://www.gnu.org/licenses/>.
 * $Id: RBB_collision.js 2014-01-28 buixuan $
 * ******************************************************/

//--------------------------//
// INIT SOME CONFIGURATIONS //
//--------------------------//

//import { Position } from './position';


var context=main_window.getContext('2d');
var width=main_window.width;
var height=main_window.height;
var friction=1;

var test = new Bille(new Cercle(new Position(3*width/4, height/2), height/8), "#FF0000", "#FF2400");
var test2 = new Bille(new Cercle(new Position(2*width/4, height/3), height/8), "#FF0000", "#FF2400", new Position(5, 10));

var red = new player(0x51E77E,
                     new avatar(3*width/4,height/2,height/8,"#FF0000","#FF2400")
                    );
var blue = new player(0xED1C7E,
                      new avatar(width/4,height/2,height/8,"#0000FF","#0066FF")
                     );
var black = new player(0xBADDAD,
                       new avatar(width/2,height/2,height/4.5,"#000000","#505050")
                      );
var goal = {x:width-blue.avatar.radius,y:height/3,
            width:width-blue.avatar.radius/2,height:height/3};
var players = new Array(red,blue,black);
//--------------------------//
// END OF CONFIGURATIONS    //
//--------------------------//

onmousemove = function(e){
test.cercle.position.x = e.clientX;
test.cercle.position.y = e.clientY
}

function avatar(x,y,r,c,bc){
  //this.name="CIRCLE";
  this.position = new Position(x, y);
  this.x=x;
  this.y=y;
  this.radius=r;
  this.color=c;
  this.bordercolor=bc;
}


function player(id, avatar){
  //this.id=id;
  this.avatar=avatar;
  this.vitesse = new Position(0, 0);
  this.vitesse.x=0;
  this.vitesse.y=0;

  this.updateFriction=updateFriction;
  function updateFriction(){ this.vitesse.x*=friction; this.vitesse.y*=friction; }


  this.updateCollisionBorder=updateCollisionBorder;
  function updateCollisionBorder(){ 
    if (collisionLeftBorder(avatar)){ this.vitesse.x*=-1; this.avatar.x=this.avatar.radius;  }
    if (collisionRightBorder(avatar)){ this.vitesse.x*=-1; this.avatar.x=width-this.avatar.radius;  }
    if (collisionTopBorder(avatar)){ this.vitesse.y*=-1; this.avatar.y=this.avatar.radius;  }
    if (collisionBottomBorder(avatar)){ this.vitesse.y*=-1; this.avatar.y=height-this.avatar.radius;  }
    return false;
  }
  
  this.updateCollisionSameMass=updateCollisionSameMass;
  function updateCollisionSameMass(otherPlayer){
    if(collisionCircles(this.avatar, otherPlayer.avatar)){
      var x1=this.avatar.x;
      var y1=this.avatar.y;
      var r1=this.avatar.radius;
      var x2=otherPlayer.avatar.x;
      var y2=otherPlayer.avatar.y;
      var r2=otherPlayer.avatar.radius;
      var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
      var nx = (x2 - x1)/(r1+r2);
      var ny = (y2 - y1)/(r1+r2);
      var gx = -ny;
      var gy = nx;
      var v1n = nx*this.vitesse.x + ny*this.vitesse.y;
      var v1g = gx*this.vitesse.x + gy*this.vitesse.y;
      var v2n = nx*otherPlayer.vitesse.x + ny*otherPlayer.vitesse.y;
      var v2g = gx*otherPlayer.vitesse.x + gy*otherPlayer.vitesse.y;
      this.vitesse.x = nx*v2n +  gx*v1g;
      this.vitesse.y = ny*v2n +  gy*v1g;
      otherPlayer.vitesse.x = nx*v1n +  gx*v2g;
      otherPlayer.vitesse.y = ny*v1n +  gy*v2g;
      
      otherPlayer.vitesse.x = this.vitesse.x;
      otherPlayer.vitesse.y = this.vitesse.y;
      
      otherPlayer.avatar.x = x1 + (r1+r2)*(x2-x1)/d;
      otherPlayer.avatar.y = y1 + (r1+r2)*(y2-y1)/d;
      return true;
    }
    return false;
  }

  this.updateCollisionInfiniteMass=updateCollisionInfiniteMass;
  function updateCollisionInfiniteMass(otherPlayer){
    if(collisionCircles(this.avatar,otherPlayer.avatar)){
      var x1=otherPlayer.avatar.x;
      var y1=otherPlayer.avatar.y;
      var r1=otherPlayer.avatar.radius;
      var x2=this.avatar.x;
      var y2=this.avatar.y;
      var r2=this.avatar.radius;
      var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
      var nx = (x2 - x1)/(r1+r2);
      var ny = (y2 - y1)/(r1+r2);
      var pthis = this.vitesse.x*nx+this.vitesse.y*ny;
      this.vitesse.x = this.vitesse.x - 2*pthis*nx;
      this.vitesse.y = this.vitesse.y - 2*pthis*ny;
 
      this.avatar.x = x1 + (r1+r2)*(x2-x1)/d;
      this.avatar.y = y1 + (r1+r2)*(y2-y1)/d;
      return true;
    }
    return false;
  }

  this.updatePosition=updatePosition;
  function updatePosition(){ this.avatar.x+=this.vitesse.x; this.avatar.y+=this.vitesse.y; }
 
  this.draw=draw;
  function draw(){
    context.beginPath();
    var g=context.createRadialGradient(this.avatar.x,this.avatar.y,this.avatar.radius*0.98,this.avatar.x,this.avatar.y,this.avatar.radius);
    g.addColorStop(0,this.avatar.color);
    g.addColorStop(1,this.avatar.bordercolor);
    context.fillStyle=g;
    context.arc(this.avatar.x,this.avatar.y,
                this.avatar.radius,0,Math.PI*2,true);
    context.fill();
    context.closePath();
  }
}



function on_enter_frame(){
  if(collisionCircleBox(blue.avatar,goal)){
    onWin();
    context.fillStyle=blue.avatar.color;
    context.textAlign="center";
    context.font="200px Arial";
    context.fillText("Gagné!",width/2,height/2);
  } else {
    var collisionCheck=false;
    for (var i=0;i<players.length;i++) {
      players[i].updateFriction();
      //players[i].updateCommands();
      collisionCheck|=players[i].updateCollisionBorder();
    }

    collisionCheck|=players[1].updateCollisionSameMass(players[0]);
    collisionCheck|=players[1].updateCollisionInfiniteMass(players[2]);
 
    if(collisionCheck){onCollision();}
 
    context.clearRect(0,0,width,height);
    context.fillStyle=blue.avatar.color;
    context.fillRect(goal.x,goal.y,goal.width,goal.height);
    
    test.dessiner(context);
    test2.updateCollisionBorder(width, height);
    test2.updatePosition();
    test2.dessiner(context);
    test.updateCollisionSameMass(test2);

    for (var i=players.length-1;i>-1;i--) {
      players[i].updatePosition();
      //players[i].draw();
      //frame_player(players[i]);
      players[i].draw();
    }
  }
}


