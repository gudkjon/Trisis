function spatialManager() {
    map : []
}
spatialManager.prototype.setMap = function() {
    this.map = [];
    for(var y = 0; y < mapheight; y++) {
        this.map[y] = [];
        for(var x = 0; x < mapwidth; x++) {
            this.map[y][x] = [];
            for(var z = 0; z < mapbreadth; z++) {
                this.map[y][x][z] = false;
            }
        }
    }
};
spatialManager.prototype.render = function(mv) {
    var mvstack = [];
    mv = mult(mv, scale4(0.2,0.2,0.2));
    for(var y = 0; y < mapheight; y++) {
        for(var x = 0; x < mapwidth; x++) {
            for(var z = 0; z < mapbreadth; z++) {   
                if(this.map[y][x][z]) {
                    mvstack.push(mv);
                    mv = mult(mv,translate((3-x)/2,(-10+y)/2, (3-z)/2));
                    util.drawCube(mv, this.map[y][x][z], vBuffer);
                    mv = mvstack.pop();
                }
            }
        }
    }
};
spatialManager.prototype.register = function(cube) {
    var x = cube.cx;
    var y = cube.cy;
    var z = cube.cz;
    if(this.outOfBounds(x,y,z)) return false;
    this.map[y][x][z] = cube.colorBuffer;
}
spatialManager.prototype.unregister = function(cube) {
    var x = cube.cx;
    var y = cube.cy;
    var z = cube.cz;
    if(this.outOfBounds(x,y,z)) return;
    this.map[y][x][z] = false;
}
spatialManager.prototype.canFit = function(cube) {
    var x = cube.cx;
    var y = cube.cy;
    var z = cube.cz;
    if(this.outOfBounds(x,y,z) || this.map[y][x][z]) return false;
    return true;
}   
spatialManager.prototype.outOfBounds = function(x,y,z) {
    return x < 0 || x > 5 || z < 0 || z > 5 || y < 0 || y > 19;
}
spatialManager.prototype.addFloor = function() {
    this.map[19] = [];
    for(var x = 0; x < mapwidth; x++) {
        this.map[19][x] = [];
        for(var z = 0; z < mapbreadth; z++) {
            this.map[19][x][z] = false;
        }
    }
}
spatialManager.prototype.checkFloor = function(y) {
    var full = true;
    for(var x = 0; full && x < mapwidth; x++) {
        for(var z = 0; z < mapbreadth; z++) {
            if(!this.map[y][x][z]){
                var full = false;
            }
        }
    }
    if(full) {
        this.map.splice(y,1);
        this.addFloor();
        score += 100;
        document.getElementById("score").innerHTML = "Score: " + score;
        return true;
    }
    return false;
}
