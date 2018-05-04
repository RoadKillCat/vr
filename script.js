'use strict';

//layout / html
let cnvs_l = document.getElementById('cnvs_l');
let cnvs_r = document.getElementById('cnvs_r');
let cnvii  = document.getElementById('cnvii');
let border_width = 2; //px

//rendering
let horizon = 8;
let eye_dist = 0.2;
let wireframe = false;
let cam = {x: 0,
           y: -2,
           z: 0,
           yaw: 0,
           pitch: 0,
           roll: 0,
           fov: 60,
           step: 0.02,
           offset_yaw: 0,
           offset_pitch: 0,
           offset_roll: 0
           };

//general
let screen = blocks;
let first_orientation_event = true;

document.addEventListener('DOMContentLoaded', start);

function start(){
    fts();
    screen.init();
    document.addEventListener('keypress', keypress);
    window.addEventListener('deviceorientation', orient);
    window.requestAnimationFrame(update);
}

function update(time){
    render_world(screen.gen_world());
    window.requestAnimationFrame(update);
}

function keypress(e){
    if (screen.key_funcs.hasOwnProperty(e.key)){
        screen.key_funcs[e.key]();
    }
}

function orient(e){
    if (!(e.alpha && e.beta && e.gamma)) {
        console.log('unfortunately your device does not support vr');
        return;
    }
    cam.raw_yaw   = ((e.gamma < 0 ? e.alpha : (e.alpha + 180) % 360) - 180) * -1;
    cam.raw_pitch = (e.gamma < 0 ? -90 : 90) - e.gamma;
    cam.raw_roll  =  e.gamma < 0 ? (e.beta < 0 ? -180 : 180) - e.beta : e.beta;
    cam.raw_roll  = (cam.raw_roll < 0 ? 180 : -180) + cam.raw_roll;
    console.log(cam.raw_yaw, cam.raw_pitch, cam.raw_roll);
    if (first_orientation_event){
        helpers.calibrate();
        first_orientation_event = false;
    }
    cam.yaw   = cam.raw_yaw   + cam.offset_yaw;
    cam.pitch = cam.raw_pitch + cam.offset_pitch;
    cam.roll  = cam.raw_roll  + cam.offset_roll;
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
                   cnvs_l, wireframe, horizon);
    //right eye
    zengine.render(world, {x: cam.x + eye_dist/2 * Math.cos(zengine.to_rad(cam.yaw)),
                           y: cam.y - eye_dist/2 * Math.sin(zengine.to_rad(cam.yaw)),
                           z: cam.z,
                           yaw: cam.yaw,
                           pitch: cam.pitch,
                           roll: cam.roll,
                           fov: cam.fov},
                   cnvs_r, wireframe, horizon);
}

function fts(){
    cnvs_l.width = cnvs_r.width = (innerWidth - border_width) / 2;
    cnvs_l.height = cnvs_r.height = innerHeight;
    cnvs_l.style.borderRight = 
    cnvs_r.style.borderLeft  = 
    (border_width/2).toString() + 'px dotted black';
}
