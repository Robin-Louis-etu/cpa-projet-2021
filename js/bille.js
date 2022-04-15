function Bille(cercle, couleur, bordure) {
	this.cercle = cercle;
	this.couleur = couleur;
	this.bordure = bordure;
	this.vitesse = new Position(0, 0);
	
	this.dessiner = dessiner;
	function dessiner(contexte) {
		cercle.draw(contexte, this.couleur, this.bordure);
	}
}
