function StraightTrisis(descr) {
	this.setup(descr);
    this["cubes"] = [];
    for(var i = 0; i < 3; i++) {
        this["cubes"][i] = new Entity({
            offsetx: 1-i,
            offsety: 0,
            offsetz: 0,
            colorBuffer: descr.colorBuffer
        });
    }
    this.setPosCubes();
}
StraightTrisis.prototype = new Entity();