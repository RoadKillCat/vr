'use strict';

let blocks = {
    init: function(){
        cam.x = cam.y = 0;
        cam.z = 2;
        blocks.last_place = 0;
        blocks.place_speed = 400; //delay
        blocks.blocks = [];
        for (let x = -10; x < 10; x++){
            for (let y = -10; y < 10; y++){
                blocks.blocks.push({x: x, y: y, z: parseInt(perlin.get(x/10, y/10)*10), b: objects.grass});
            }
        }
    },
    gen_world: function(){
        let cam_vect = {x: Math.cos(zengine.to_rad(cam.pitch)) * Math.sin(zengine.to_rad(cam.yaw)),
                        y: Math.cos(zengine.to_rad(cam.pitch)) * Math.cos(zengine.to_rad(cam.yaw)),
                        z: Math.sin(zengine.to_rad(cam.pitch))};
        let world = [];
        for (let i = 0; i < blocks.blocks.length; i++){
            world = world.concat(blocks.blocks[i].b().map(
                f => ({verts: f.verts.map(zengine.translate(blocks.blocks[i].x,
                                                            blocks.blocks[i].y,
                                                            blocks.blocks[i].z)),
                       vect: f.vect,
                       col:  f.col})
            ));
        }
        return world;
    },
    place: function(){
        let t = performance.now();
        if (!(t - blocks.last_place > blocks.place_speed)) return;
        blocks.last_place = t;
        blocks.blocks.sort((a,b)=>zengine.distance(cam, {x:a.x+0.5, y: a.y+0.5, z:a.z+0.5}) -
                                  zengine.distance(cam, {x:b.x+0.5, y: b.y+0.5, z:b.z+0.5}));
        for (let i = 0; i < blocks.blocks.length; i++){
            let blk = objects.cube().map(f => ({verts:
            f.verts.map(zengine.translate(blocks.blocks[i].x, blocks.blocks[i].y, blocks.blocks[i].z)),
                                                vect: f.vect}))
                                    .sort((a,b)=>zengine.distance(cam, zengine.centroid(a.verts))-
                                                 zengine.distance(cam, zengine.centroid(b.verts)));
            for (let j = 0; j < blk.length; j++){
                let f = blk[j].verts.map(zengine.translate(-cam.x, -cam.y, -cam.z))
                                    .map(zengine.z_axis_rotate(zengine.to_rad(cam.yaw)))
                                    .map(zengine.y_axis_rotate(zengine.to_rad(cam.roll)))
                                    .map(zengine.x_axis_rotate(zengine.to_rad(cam.pitch)))
                                    .map(zengine.translate(cam.x, cam.y, cam.z));
                //convert face to 2d
                f = f.map(c=>({x: zengine.to_deg(Math.atan2(c.x - cam.x, c.y - cam.y)),
                               y: zengine.to_deg(Math.atan2(c.z - cam.z, c.y - cam.y))}));
                //bounding box quick check
                let min_x = f[0].x;
                let max_x = f[0].x;
                let min_y = f[0].y;
                let max_y = f[0].y;
                for (let i = 1; i < f.length; i++){
                    min_x = Math.min(min_x, f[i].x);
                    max_x = Math.max(max_x, f[i].x);
                    min_y = Math.min(min_y, f[i].y);
                    max_y = Math.max(max_y, f[i].y);
                }
                if (min_x > 0 || max_x < 0 || min_y > 0 || max_y < 0) continue;
                //if passed bounding box, try ray casting
                let inside = false;
                for (let ii = 0; ii < f.length; ii++){
                    let jj = ii < f.length - 1 ? ii + 1 : 0;
                    //check if crosses line and if that cross is to the right of the point
                    if ((f[ii].y < 0 && f[jj].y > 0 || f[ii].y > 0 && f[jj].y < 0) &&
                        0 < ((0 - f[ii].y) * (f[jj].x - f[ii].x)) / (f[jj].y - f[ii].y) + f[ii].x){
                        inside = !inside;
                    }
                }
                if (!inside) continue;
                console.log('hit');
                let nb = {x: blocks.blocks[i].x + blk[j].vect.x,
                          y: blocks.blocks[i].y + blk[j].vect.y,
                          z: blocks.blocks[i].z + blk[j].vect.z,
                          b: objects.cube};
                //may be needed if ordering not effective...
                //for (let ii = 0; i < blocks.blocks.length; i++){
                //    if (blocks.blocks[i].x == nb.x &&
                //        blocks.blocks[i].y == nb.y &&
                //        blocks.blocks[i].z == nb.z 
                blocks.blocks.push(nb);
                return;
            }
        }
    },
    take_step: function(angle){
        /*let next = {x: cam.x + cam.step * Math.sin(zengine.to_rad(angle)),
                    y: cam.y + cam.step * Math.cos(zengine.to_rad(angle))};
        let blk = {x: Math.floor(next.x),
                   y: Math.floor(next.y)};
                   z
        if (blk.x < 0 || blk.y < 0 || blk.x > blocks.width || blk.y > blocks.height || !blocks.maze[blk.y][blk.x]){
            cam.x = next.x;
            cam.y = next.y;
        }*/
        cam.x += cam.step * Math.sin(zengine.to_rad(angle));
        cam.y += cam.step * Math.cos(zengine.to_rad(angle));
    },
    hud: function(time){
        let r = 4;
        //distance from centre that the hud should be translated
        let dst = zengine.to_deg(Math.atan2(cam.eye_dist/2, cam.hud_dist)) / cam.fov * cnvs_l.width;
        ctx_l.beginPath();
        ctx_r.beginPath();
        ctx_l.arc(cnvs_l.width/2 + dst, cnvs_l.height/2, r, 0, Math.PI * 2);
        ctx_r.arc(cnvs_r.width/2 - dst, cnvs_r.height/2, r, 0, Math.PI * 2);
        ctx_l.stroke();
        ctx_r.stroke();
    }
}

blocks.key_funcs = {
    'w': ()=>{blocks.take_step(cam.yaw)},
    'a': ()=>{blocks.take_step(cam.yaw-90)},
    's': ()=>{blocks.take_step(cam.yaw+180)},
    'd': ()=>{blocks.take_step(cam.yaw+90)},
    'i': helpers.calibrate,
    'k': blocks.place,
    'o': ()=>{cam.z += cam.step},
    'l': ()=>{cam.z -= cam.step},
    //pc funcs for when testing without phone
    'e': ()=>{cam.yaw   += 10},
    'q': ()=>{cam.yaw   -= 10},
    'r': ()=>{cam.pitch += 10},
    'f': ()=>{cam.pitch -= 10}
}
