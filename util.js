"use strict";




var util = {
	vertices : [
	    vec3( -0.25, -0.25,  0.25 ),
        vec3( -0.25,  0.25,  0.25 ),
        vec3(  0.25,  0.25,  0.25 ),
        vec3(  0.25, -0.25,  0.25 ),
        vec3( -0.25, -0.25, -0.25 ), //nidri vinstri aftan
        vec3( -0.25,  0.25, -0.25 ), //uppi vinstri aftan
        vec3(  0.25,  0.25, -0.25 ), //uppi haegri aftan
        vec3(  0.25, -0.25, -0.25 ) //nidri haegri aftan
	],
	quad : function(a,b,c,d) {
		var indices = [0,1,2,0,2,3];
	    var result = [];
	    for(var i = 0; i < indices.length; i++) {
	        result.push(util.vertices[arguments[indices[i]]]);
	    }
	    return result;
	},
	cube : function() {
	    var result = util.quad(1, 0, 3, 2); //aftan
		result = result.concat(util.quad(2, 3, 7, 6)); //framan
		result = result.concat(util.quad(3, 0, 4, 7)); //vinstri
		result = result.concat(util.quad(6, 5, 1, 2)); //haegri
		result = result.concat(util.quad(4, 5, 6, 7)); //upp
		result = result.concat(util.quad(5, 4, 0, 1)); //nidri
		return result;
	},
	rcube : function() {
		var result = util.quad(2, 3, 0, 1); //aftan
		result = result.concat(util.quad(6, 7, 3, 2)); //framan
		result = result.concat(util.quad(7, 4, 0, 3)); //vinstri
		result = result.concat(util.quad(2, 1, 5, 6)); //haegri
		result = result.concat(util.quad(7, 6, 5, 4)); //upp
		result = result.concat(util.quad(1, 0, 4, 5)); //nidri
		return result;
	},
	drawCube : function(mv, colorBuffer, vertexBuffer) {
	    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
	    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	    gl.enableVertexAttribArray( vColor );
	    
	    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	    gl.enableVertexAttribArray( vPosition );

	    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
	    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	}
}