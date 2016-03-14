// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity(descr) {


    for (var property in descr) {
        this[property] = descr[property];
    }
    this["cubes"] = [];
};
//Entity.prototype.points = [];
Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.xRotation = 0;
    this.yRotation = 0;
    this.zRotation = 0;
};

Entity.prototype.points = util.cube(this.vertices);
Entity.prototype.numVertices = 36;
Entity.prototype.moveTimer = 0;
Entity.prototype.moveThreshold = 500;
Entity.prototype._isDeadNow = false;
Entity.prototype.setPos = function (pos) {
    this.cx = pos[0];
    this.cy = pos[1];
    this.cz = pos[2];
};

Entity.prototype.getPos = function () {
    return {cx : this.cx, cy : this.cy, cz : this.cz};
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
    this.mapCubes();
    var killed = false;
    for(var y = 0; y < this.cubes.length; y++) {
        killed = killed || spatialManager.checkFloor(this.cy);
    }
    if(!killed && this.cy == 19 && this.cx === 3 && this.cz === 3)
        gameRunning = false;
};

Entity.prototype.update = function(du) {
    this.unmapCubes();
    var prev = {
        cx: this.cx,
        cy: this.cy,
        cz: this.cz,
        xRotation : this.xRotation,
        yRotation : this.yRotation,
        zRotation : this.zRotation
    };
    du = isNaN(du) ? 16 : du;
    this.moveTimer = this.moveTimer + (keys[keyspace] ? du*20 : du);
    if(this.moveTimer > this.moveThreshold) {
        this.cy -= 1;
        this.setPosCubes();
        this.moveTimer = 0;
        if(!this.mapCubes()) {
            this.setTo(prev);
            this.setPosCubes();
            this.kill(); 
            return;
        }
        this.unmapCubes();
    }
    prev = {
        cx: this.cx,
        cy: this.cy,
        cz: this.cz,
        xRotation : this.xRotation,
        yRotation : this.yRotation,
        zRotation : this.zRotation
    };
    if(eatKey(keyup)) {
        if(this.cz > 0)
            this.cz -= 1;
    }
    if(eatKey(keydown)) {
        if(this.cz <= 6)
            this.cz += 1;
    }
    if(eatKey(keyleft)) {
        if(this.cx > 0)
            this.cx -= 1;
    }
    if(eatKey(keyright)) {
        if(this.cx <= 6)
            this.cx += 1;
    }  
    if(eatKey(keyA)) {
        this.xRotation += 90;
    }
    if(eatKey(keyZ)) {
        this.xRotation -= 90;
    }
    if(eatKey(keyS)) {
        this.yRotation += 90;
    }
    if(eatKey(keyX)) {
        this.yRotation -= 90; 
    }
    if(eatKey(keyD)) {
        this.zRotation += 90;
    }
    if(eatKey(keyC)) {
        this.zRotation -= 90; 
    }
    this.setPosCubes();
    var fits = this.mapCubes();
    if(!fits) {
        this.setTo(prev);
        this.setPosCubes();
        this.mapCubes();
    }
};
/*Entity.prototype.render = function(mv) {
    var mvst = [];
    console.log("rendering")
    for(var i = 0; i < 0; i++) {
        mvst.push(mv);
        mv = mult(mv, scale4(0.2,0.2,0.01))
        mv = mult(mv, translate(3-this.cubes[i].cx,10-this.cubes[i].cy,-3));
        util.drawCube(mv, blackBuffer, vBuffer);
        mv = mvst.pop();
        mvst.push(mv);
        mv = mult(mv, scale4(0.2,0.2,0.01))
        mv = mult(mv, translate(3-this.cubes[i].cx,10-this.cubes[i].cy,3));
        util.drawCube(mv, blackBuffer, vBuffer);
        mv = mvst.pop();
        mvst.push(mv);
        mv = mult(mv, scale4(0.01,0.2,0.2))
        mv = mult(mv, translate(3,10-this.cubes[i].cy,3-this.cubes[i].cz));
        util.drawCube(mv, blackBuffer, vBuffer);
        mv = mvst.pop();
        mvst.push(mv);
        mv = mult(mv, scale4(0.01,0.2,0.2))
        mv = mult(mv, translate(-3,10-this.cubes[i].cy,3-this.cubes[i].cz));
        util.drawCube(mv, blackBuffer, vBuffer);
        mv = mvst.pop();
    }
};*/
Entity.prototype.findCoordsRotation = function(x,y,z,xRot,yRot,zRot) {
    xRot = radians(xRot);
    yRot = radians(yRot);
    zRot = radians(zRot);
    var x2 = x;
    var y2 = y*Math.cos(xRot) + z*(-Math.sin(xRot));
    var z2 = y*Math.sin(xRot) + z*Math.cos(xRot);

    var x3 = x2*Math.cos(yRot) + z2*Math.sin(yRot);
    var y3 = y2;
    var z3 = x2*(-Math.sin(yRot)) + z2*Math.cos(yRot);

    var x4 = x3*Math.cos(zRot) + y3*(-Math.sin(zRot)); 
    var y4 = x3*Math.sin(zRot) + y3*Math.cos(zRot);
    var z4 = z3;
    return vec3(Math.round(x4),Math.round(y4),Math.round(z4));
}
Entity.prototype.getPosCubes = function() {
    var pos = this.getPos(); // fer einn til vinstri og einn upp    x-rot
    pos = vec3(pos.cx,pos.cy,pos.cz); 
    var pos1 = add(pos, this.findCoordsRotation(this.cubes[0].offsetx,this.cubes[0].offsety,this.cubes[0].offsetz,this.xRotation,this.yRotation,this.zRotation));
    var pos2 = add(pos, this.findCoordsRotation(this.cubes[2].offsetx,this.cubes[2].offsety,this.cubes[2].offsetz,this.xRotation,this.yRotation,this.zRotation));
    return {
        cube1 : pos,
        cube2 : pos1,
        cube3 : pos2
    };
};

Entity.prototype.setPosCubes = function(){
    var cubePos = this.getPosCubes();
    var i = 0;
    for(var pos in cubePos) {
        this.cubes[i].setPos(cubePos[pos]);
        i++;
    }
};
Entity.prototype.mapCubes = function() {
    var canFit = true;
    for(var i = 0; i < this.cubes.length; i++) {
        canFit = canFit && spatialManager.canFit(this.cubes[i]);
    }
    if(!canFit) return false;
    for(var i = 0; i < this.cubes.length; i++) {
        spatialManager.register(this.cubes[i]);
    }
    return true;
};
Entity.prototype.unmapCubes = function() {
    for(var i = 0; i < this.cubes.length; i++) {
        spatialManager.unregister(this.cubes[i]);
    }   
};
Entity.prototype.setTo = function(prev) {
    this.xRotation = prev.xRotation;
    this.yRotation = prev.yRotation;
    this.zRotation = prev.zRotation;
    this.cx = prev.cx;
    this.cy = prev.cy;
    this.cz = prev.cz;
}
