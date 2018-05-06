'use strict';

//layout / html
let cnvs_l = document.getElementById('cnvs_l');
let cnvs_r = document.getElementById('cnvs_r');
let cnvii  = document.getElementById('cnvii');
let border_width = 2; //px

//get contexts for HUDs etc.
let ctx_l = cnvs_l.getContext('2d')
let ctx_r = cnvs_r.getContext('2d')
//useful for getting side of the canvii
let cnvs_w;
let cnvs_h;

//rendering
let wireframe = false;
let cam = {x: 0,
           y: -2,
           z: 0,
           yaw: 0,
           pitch: 0,
           roll: 0,
           fov: 60,
           step: 0.02,
           horizon: 8,
           eye_dist: 0.2,
           hud_dist: 1
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

let last_time = 0;
let updates = 0;
function update(time){
    updates++;
    render_world(screen.gen_world());
    if (screen.hud) screen.hud(time);
    window.requestAnimationFrame(update);
    if (time - last_time > 1000){
        last_time = time;
        console.log(updates);
        updates = 0;
    }

}

function keypress(e){
    if (screen.key_funcs[e.key])
    screen.key_funcs[e.key]();
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
    zengine.render(world,
                          {x: cam.x - cam.eye_dist/2 * Math.cos(zengine.to_rad(cam.yaw)),
                           y: cam.y + cam.eye_dist/2 * Math.sin(zengine.to_rad(cam.yaw)),
                           z: cam.z,
                           yaw: cam.yaw,
                           pitch: cam.pitch,
                           roll: cam.roll,
                           fov: cam.fov},
                   cnvs_l, wireframe, cam.horizon);
    //right eye
    zengine.render(world,
                          {x: cam.x + cam.eye_dist/2 * Math.cos(zengine.to_rad(cam.yaw)),
                           y: cam.y - cam.eye_dist/2 * Math.sin(zengine.to_rad(cam.yaw)),
                           z: cam.z,
                           yaw: cam.yaw,
                           pitch: cam.pitch,
                           roll: cam.roll,
                           fov: cam.fov},
                   cnvs_r, wireframe, cam.horizon);
}

function fts(){
    cnvs_w = cnvs_l.width  = cnvs_r.width = (innerWidth - border_width) / 2;
    cnvs_h = cnvs_l.height = cnvs_r.height = innerHeight;
    cnvs_l.style.borderRight =
    cnvs_r.style.borderLeft  =
    (border_width/2).toString() + 'px dotted black';
}
