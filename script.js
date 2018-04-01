'use strict';

var msg = document.getElementById('msg');
var cnvs_l = document.getElementById('cnvs_l');
var cnvs_r = document.getElementById('cnvs_r');
var cnvii = document.getElementById('cnvii');

function fts(){
    cnvs_l.width = cnvs_r.width = innerWidth / 2;
    cnvs_l.height = cnvs_r.height = innerHeight;
}

screen.orientation.onchange = function(){
	if (/landscape/.test(screen.orientation.type)){
		cnvii.style.display = 'inline';
		msg.style.display = 'none';
		setTimeout(fts, 500);
    } else {
		cnvii.style.display = 'none';
        msg.style.display = 'block';
   }
}

fts();

function block(col){
    return [{verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 0, y: 1, z: 0}], col: col},
            {verts: [{x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 1}, {x: 0, y: 0, z: 1}], col: col},
            {verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 0, z: 1}, {x: 0, y: 0, z: 1}], col: col},
            {verts: [{x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 1, y: 0, z: 1}], col: col},
            {verts: [{x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: col},
            {verts: [{x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: col}]
}
