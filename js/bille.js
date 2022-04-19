function Bille(cercle, couleur, bordure, vitesse = new Position(0, 0)) {
	this.cercle = cercle;
	this.couleur = couleur;
	this.bordure = bordure;
	this.vitesse = vitesse;
	
	this.dessiner = dessiner;
	function dessiner(contexte) {
		cercle.draw(contexte, this.couleur, this.bordure);
	}
	
	this.updateCollisionBorder=updateCollisionBorder;
	function updateCollisionBorder(largeur, hauteur) { 
		if (this.cercle.collisionBordureGauche()) { this.vitesse.x *= -1; this.cercle.position.x = this.cercle.rayon; return true; }
		if (this.cercle.collisionBordureDroite(largeur)) { this.vitesse.x *= -1; this.cercle.position.x = largeur - this.cercle.rayon; return true; }
		if (this.cercle.collisionBordureHaute()){ this.vitesse.y *= -1; this.cercle.position.y = this.cercle.rayon; return true; }
		if (this.cercle.collisionBordureBasse(hauteur)) { this.vitesse.y *= -1; this.cercle.position.y = hauteur - this.cercle.rayon; return true; }
		return false;
	}
	
    this.updateCollisionSameMass = updateCollisionSameMass;
    function updateCollisionSameMass(bille) {
        if (collisionCercles(this.cercle, bille.cercle)) {
            var x1 = this.cercle.position.x;
            var y1 = this.cercle.position.y;
            var r1 = this.cercle.rayon;
            var x2 = bille.cercle.position.x;
            var y2 = bille.cercle.position.y;
            var r2 = bille.cercle.rayon;
            var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            var nx = (x2 - x1) / (r1 + r2);
            var ny = (y2 - y1) / (r1 + r2);
            var gx = -ny;
            var gy = nx;
            var v1n = nx * this.vitesse.x + ny * this.vitesse.y;
            var v1g = gx * this.vitesse.x + gy * this.vitesse.y;
            var v2n = nx * bille.vitesse.x + ny * bille.vitesse.y;
            var v2g = gx * bille.vitesse.x + gy * bille.vitesse.y;

            this.vitesse.x = nx * v2n + gx * v1g;
            this.vitesse.y = ny * v2n + gy * v1g;
            bille.vitesse.x = nx * v1n + gx * v2g;
            bille.vitesse.y = ny * v1n + gy * v2g;

            this.updatePosition();
            bille.updatePosition();

            //bille.cercle.position.x = x1 + (r1 + r2) * (x2 - x1) / d;
            //bille.cercle.position.y = y1 + (r1 + r2) * (y2 - y1) / d;
            //this.cercle.position.x = x1 + (r1 + r2) * (x2 - x1) / d;
            //this.cercle.position.y = y1 + (r1 + r2) * (y2 - y1) / d;

            return true;
        }
        return false;
    }
  
  this.updateCollisionInfiniteMass=updateCollisionInfiniteMass;
  function updateCollisionInfiniteMass(bille){
    if(collisionCircles(this.cercle,bille.cercle)){
      var x1=bille.cercle.position.x;
      var y1=bille.cercle.y;
      var r1=bille.cercle.rayon;
      var x2=this.cercle.position.x;
      var y2=this.cercle.y;
      var r2=this.cercle.rayon;
      var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
      var nx = (x2 - x1)/(r1+r2);
      var ny = (y2 - y1)/(r1+r2);
      var pthis = this.vitesse.x*nx+this.vitesse.y*ny;
      this.vitesse.x = this.vitesse.x - 2*pthis*nx;
      this.vitesse.y = this.vitesse.y - 2*pthis*ny;
 
      this.cercle.position.x = x1 + (r1+r2)*(x2-x1)/d;
      this.cercle.y = y1 + (r1+r2)*(y2-y1)/d;
      return true;
    }
    return false;
  }
  
    this.updatePosition=updatePosition;
  function updatePosition(){ this.cercle.position.x+=this.vitesse.x; this.cercle.position.y+=this.vitesse.y; }
 
}
