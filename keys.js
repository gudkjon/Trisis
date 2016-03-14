// =================
// KEYBOARD HANDLING
// =================

var keys = [];
var keyup = 38, keydown = 40, keyright = 39, keyleft = 37, keyspace = keyCode(' ');
var keyA = keyCode('A'), keyZ = keyCode('Z'),keyS = keyCode('S'),keyX = keyCode('X'),keyD = keyCode('D'),keyC = keyCode('C');

function handleKeydown(evt) {
    keys[evt.keyCode] = true;
    if(evt.keyCode === keyCode(' ') || evt.keyCode === keyup || evt.keyCode === keyright || evt.keyCode === keyleft || evt.keyCode === keydown)
        evt.preventDefault();
}

function handleKeyup(evt) {
    keys[evt.keyCode] = false;
    if(evt.keyCode === keyCode(' ') || evt.keyCode === keyup || evt.keyCode === keyright || evt.keyCode === keyleft || evt.keyCode === keydown)
        evt.preventDefault();
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
}

// A tiny little convenience function
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);