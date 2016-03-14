function CurvedTrisis(descr) {
	this.setup(descr);
    this["cubes"] = [];
    this["cubes"].push(new Entity({
        offsetx: 1,
        offsety: 0,
        offsetz: 0,
        colorBuffer: descr.colorBuffer
    }));
    this["cubes"].push(new Entity({
        offsetx: 0,
        offsety: 0,
        offsetz: 0,
        colorBuffer: descr.colorBuffer
    }));
    this["cubes"].push(new Entity({
        offsetx: 0,
        offsety: -1,
        offsetz: 0,
        colorBuffer: descr.colorBuffer
    }));
    this.setPosCubes();
}
CurvedTrisis.prototype = new Entity();
