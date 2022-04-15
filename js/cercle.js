function Cercle(position, rayon){
	this.position = position;
	this.rayon = rayon;
	
	this.collisionBordureGauche = collisionBordureGauche;
	function collisionBordureGauche() {
		return this.position.x <= this.rayon;
	}
	
	this.collisionBordureDroite = collisionBordureDroite;
	function collisionBordureDroite(largeur) {
		return this.position.x + this.rayon >= largeur;
	}
	
	this.collisionBordureHaute = collisionBordureHaute;
	function collisionBordureHaute() {
		return this.position.y <= this.rayon;
	}
	
	this.collisionBordureBasse = collisionBordureBasse;
	function collisionBordureBasse(hauteur) {
		return this.position.y + this.rayon >= hauteur;
	}
	
	this.draw=draw;
  function draw(contexte, couleur, bordure){
    contexte.beginPath();
    var g=contexte.createRadialGradient(this.position.x, this.position.y, this.rayon * 0.98, this.position.x, this.position.y, this.rayon);
    g.addColorStop(0, couleur);
    g.addColorStop(1, bordure);
    contexte.fillStyle=g;
    contexte.arc(this.position.x,this.position.y,
                this.rayon,0,Math.PI*2,true);
    contexte.fill();
    contexte.closePath();
  }
}

function collisionCercles(c1,c2){
	return Math.pow(c1.position.x-c2.position.x,2)+Math.pow(c1.position.y-c2.position.y,2) <= Math.pow(c1.rayon + c2.rayon,2);
}
