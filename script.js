'use strict';

//layout / html
let cnvs_l = document.getElementById('cnvs_l');
let cnvs_r = document.getElementById('cnvs_r');
let cnvii = document.getElementById('cnvii');
let border_split = 1; //px

//rendering
let eye_dist = 0.2;
let wireframe = false;
let cam = {x: 0,
		   y: -2,
           z: 0,
           yaw: 0,
           pitch: 0,
           roll: 0,
           fov: 60,
		   step: 0.02};

//maze
let block_col = 'pink';
let maze_height, maze_width;
maze_width = maze_height = 4;
let maze_cur = maze.generate_maze(maze_width, maze_height); 

//general
let world = maze.gen_maze_world(maze_cur, block_col);

document.addEventListener('DOMContentLoaded', start);
document.addEventListener('keypress', keypress);
window.addEventListener('deviceorientation', orientation);
window.requestAnimationFrame(update);

function start(){
	fts();
}

function update(time){
    render_world(world);
    window.requestAnimationFrame(update);
}

function take_step(angle){
    let next = {x: cam.x + cam.step * Math.sin(zengine.to_rad(angle)),
                y: cam.y + cam.step * Math.cos(zengine.to_rad(angle))};
    let blk = {x: Math.floor(next.x),
               y: Math.floor(next.y)};
    if (blk.x < 0 || blk.y < 0 || blk.x > maze_width * 2 + 1 || blk.y > maze_height * 2 + 1 || !maze_cur[blk.y][blk.x]){
        cam.x = next.x;
        cam.y = next.y;
    }
}

function keypress(e){
    switch (e.key){
        case 'w':
            take_step(cam.yaw);
            break;
        case 'a':
            take_step(cam.yaw - 90);
            break;
        case 's':
            take_step(cam.yaw + 180);
            break;
        case 'd':
            take_step(cam.yaw + 90);
            break;
        case 'i':
            break;
        case 'k':
            break;
        case 'o':
            cam.z += cam.step;
            break;
        case 'l':
            cam.z -= cam.step;
            break;
	}
}

function orientation(e){
    cam.yaw   = ((e.gamma < 0 ? e.alpha : (e.alpha + 180) % 360) - 180) * -1;
    cam.pitch = (e.gamma < 0 ? -90 : 90) - e.gamma;
    cam.roll  =  e.gamma < 0 ? (e.beta < 0 ? -180 : 180) - e.beta : e.beta;
    cam.roll  = (cam.roll < 0 ? 180 : -180) + cam.roll;
}

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

function fts(){
    cnvs_l.width = cnvs_r.width = (innerWidth - border_split) / 2;
    cnvs_l.height = cnvs_r.height = innerHeight;
	cnvs_l.style.borderRight = 
    cnvs_r.style.borderLeft  = 
    border_split.toString() + 'px solid black';
}
