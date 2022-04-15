function Cercle(position, rayon){
	this.position = position;
	this.rayon = rayon;
	
	this.draw=draw;
  function draw(contexte, couleur, bordure){
  console.log(this);
    contexte.beginPath();
    var g=contexte.createRadialGradient(this.position.x, this.position.y, this.rayon * 0.98, this.position.x, this.position.y, this.rayon);
    g.addColorStop(0, couleur);
    g.addColorStop(1, bordure);
    contexte.fillStyle=g;
    contexte.arc(this.position.x,this.position.y,
                this.rayon,0,Math.PI*2,true);
    contexte.fill();
    contexte.closePath();
    console.log("fin");
  }
}
