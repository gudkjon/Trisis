/////////////////////////////////////////////////////////////////
//    SÃƒÂ½nilausn ÃƒÂ¡ dÃƒÂ¦mi 4 ÃƒÂ­ heimadÃƒÂ¦mum 4 ÃƒÂ­ TÃƒÂ¶lvugrafÃƒÂ­k
//     JÃƒÂ¶rÃƒÂ° og Mars snÃƒÂºast um sÃƒÂ³lina (allt teningar!)
//
//    HjÃƒÂ¡lmtÃƒÂ½r Hafsteinsson, febrÃƒÂºar 2015
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numVertices  = 36;
var points = [];
var spatialManager;


var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;
var score = 0;

var zDist = -3.0;
var mapwidth = 6, mapbreadth = 6, mapheight = 20;

var proLoc;
var mvLoc;
var currentBlock;
var container;
var gameRunning = true;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    initBuffers();
    
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 50.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));


    spatialManager = new spatialManager();
    spatialManager.setMap();
    
    currentBlock = new StraightTrisis({
        cx : mapwidth/2,
        cy : mapheight-1,
        cz : mapbreadth/2,
        colorBuffer : colorBuffers[bufferIterator++]
    });
    container = new Wall({
        colorBuffer : grayBuffer
    });

    
    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (origY - e.offsetY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    // Event listener for keyboard  

    // Event listener for mousewheel
     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zDist += 0.2;
         } else {
             zDist -= 0.2;
         }
     }  );
    iterGame();
}


var redColor = [];
var greenColor = [];
var blueColor = [];
var purpleColor = [];
var blackColor = [];
var grayColor = [];
for(var i = 0; i < numVertices; i++) {
    redColor.push(vec4( 1.0, 0.0, 0.0, 1.0 ));
    greenColor.push(vec4( 0.0, 1.0, 0.0, 1.0 ));
    blueColor.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    purpleColor.push(vec4(1.0,0.0,1.0,1.0));
    grayColor.push(vec4(0.2,0.2,0.2,1.0));
    blackColor.push(vec4(0.0,0.0,0.0,1.0));
}
var bufferIterator = 0;
var colorBuffers = [];
function initBuffers() {
    redBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, redBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(redColor), gl.STATIC_DRAW );
    colorBuffers.push(redBuffer);

    greenBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, greenBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(greenColor), gl.STATIC_DRAW );
    colorBuffers.push(greenBuffer);

    blueBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, blueBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(blueColor), gl.STATIC_DRAW );
    colorBuffers.push(blueBuffer);

    purpleBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, purpleBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(purpleColor), gl.STATIC_DRAW );
    colorBuffers.push(purpleBuffer);

    blackBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, blackBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(blackColor), gl.STATIC_DRAW );
    colorBuffers.push(blackBuffer);

    grayBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, grayBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(grayColor), gl.STATIC_DRAW );

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(util.cube()), gl.STATIC_DRAW );  

    rBuffer = gl.createBuffer();  
    gl.bindBuffer( gl.ARRAY_BUFFER, rBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(util.rcube()), gl.STATIC_DRAW ); 
}

//----------------------------------------------------------------------------
// Define the transformation scale here (two scale functions in MV.js)
function scale4( x, y, z )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;
}

var lastFrameTime = 0;
var frameDiff;
var lastStraight = true;
function update(frametime) {
    currentBlock.update(frametime);
    if(currentBlock._isDeadNow) {
        if(lastStraight) {
            currentBlock = new CurvedTrisis({
                cx : mapwidth/2,
                cy : mapheight-1,
                cz : mapbreadth/2,
                colorBuffer : colorBuffers[bufferIterator++]
            });
        }else{
            currentBlock = new StraightTrisis({
                cx : mapwidth/2,
                cy : mapheight-1,
                cz : mapbreadth/2,
                colorBuffer : colorBuffers[bufferIterator++]
            })
        }
        bufferIterator %= colorBuffers.length;
        lastStraight= !lastStraight;

    }


}
function render(frametime)
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //checkInputs();
    var mvstack = [];
    
    // staÃƒÂ°setja ÃƒÂ¡horfanda og meÃƒÂ°hÃƒÂ¶ndla mÃƒÂºsarhreyfingu
    var mv = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, rotate( parseFloat(spinX), [1, 0, 0] ) );
    mv = mult( mv, rotate( parseFloat(spinY), [0, 1, 0] ) );
    mvstack.push(mv);
    spatialManager.render(mv);
    mv = mvstack.pop();
    container.render(mv);

}
function iterGame(frametime) {
    frameDiff = frametime-lastFrameTime;
    lastFrameTime = frametime;
    update(frameDiff);
    render(frameDiff);
    if(gameRunning)
        requestAnimFrame( iterGame );
    else
        console.log("quitting... score was : " + score);
}
