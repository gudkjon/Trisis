function Wall(descr) {
	this.setup(descr);
}
Wall.prototype = new Entity();
Wall.prototype.render = function(mv) {
	mv = mult(mv, translate(0.05,-0.05,0.05));
	mv = mult(mv, scale4(1.25,4,1.25));
	util.drawCube(mv, this.colorBuffer, rBuffer);
}