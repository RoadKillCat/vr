'use strict';

var cnvs_l = document.getElementById('cnvs_l');
var cnvs_r = document.getElementById('cnvs_r');
var cnvii = document.getElementById('cnvii');

var eye_dist = 0.2;
var wireframe = false;
var cam = {x: 0, y: -2, z: 0, yaw: 0, pitch: 0, roll: 0, fov: 60};

function fts(){
    cnvs_l.width = cnvs_r.width = innerWidth / 2;
    cnvs_l.height = cnvs_r.height = innerHeight;
}

document.addEventListener('DOMContentLoaded', fts);

function update(time){
    render_world(block('pink'));
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

var i;
window.addEventListener('deviceorientation', function(e){
    i = e;
    cam.yaw   = (e.gamma < 0 ? e.alpha : (e.alpha + 180) % 360) - 180;
    cam.pitch = (e.gamma < 0 ? -90 : 90) - e.gamma;
    cam.roll  = e.beta;
})

function block(col){
    return [{verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 0, y: 1, z: 0}], col: col},
            {verts: [{x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 1}, {x: 0, y: 0, z: 1}], col: col},
            {verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 0, z: 1}, {x: 0, y: 0, z: 1}], col: col},
            {verts: [{x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 1, y: 0, z: 1}], col: col},
            {verts: [{x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: col},
            {verts: [{x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: col}]
}

function render_world(world){
    //left eye
    zengine.render(world, {x: cam.x - eye_dist/2 * Math.cos(zengine.to_rad(cam.yaw)),
                           y: cam.y + eye_dist/2 * Math.sin(zengine.to_rad(cam.yaw)),
                           z: cam.z,
                           yaw: cam.yaw,
                           pitch: cam.pitch,
                           roll: cam.roll,
                           fov: cam.fov},
                   cnvs_l, wireframe);
    //right eye
    zengine.render(world, {x: cam.x + eye_dist/2 * Math.cos(zengine.to_rad(cam.yaw)),
                           y: cam.y - eye_dist/2 * Math.sin(zengine.to_rad(cam.yaw)),
                           z: cam.z,
                           yaw: cam.yaw,
                           pitch: cam.pitch,
                           roll: cam.roll,
                           fov: cam.fov},
                   cnvs_r, wireframe);
}
