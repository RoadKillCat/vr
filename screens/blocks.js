'use strict';

let blocks = {
    init: function(){
        blocks.block_col = '#fc4';
        blocks.blocks = [{x: 0, y: 0, z: 0}];
    },
    gen_world: function(){
        let world = [];
        for (let i = 0; i < blocks.blocks.length; i++){
            world = world.concat(blocks.block().map(f => ({
                                    verts: f.verts.map(zengine.translate(blocks.blocks[i].x,
                                                                         blocks.blocks[i].y,
                                                                         blocks.blocks[i].z)),
                                    col: f.col})));
        }
        return world;
    },
    place: function(){
        blocks.blocks.sort((a,b)=>zengine.distance(cam, {x:a.x+0.5, y: a.y+0.5, z:a.z+0.5}) -
                                  zengine.distance(cam, {x:b.x+0.5, y: b.y+0.5, z:b.z+0.5}));
        let hit = false;
        for (let i = 0; i < blocks.blocks.length; i++){
            if (hit) break;
            let blk = blocks.block().sort((a,b)=>zengine.distance(cam, zengine.centroid(a.verts)) -
                                                 zengine.distance(cam, zengine.centroid(b.verts)));
            for (let j = 0; j < blk.length; j++){
                console.log(i, j);
                let f = blk[j].verts.map(zengine.translate(blocks.blocks[i].x,
                                                           blocks.blocks[i].y,
                                                           blocks.blocks[i].z))
                                    .map(zengine.translate(-cam.x, -cam.y, -cam.z))
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
                console.log("hellooo");
                hit = true;
                let ps = {bt: [ 0, 0,-1],
                          lt: [-1, 0, 0],
                          fr: [ 0,-1, 0],
                          rt: [ 1, 0, 0],
                          bk: [ 0, 1, 0],
                          tp: [ 0, 0, 1],
                         };
                let nb = {x: blocks.blocks[i].x + ps[blk[j].side][0],
                          y: blocks.blocks[i].y + ps[blk[j].side][1],
                          z: blocks.blocks[i].z + ps[blk[j].side][2]};
                //may be needed if ordering not effective...
                //for (let ii = 0; i < blocks.blocks.length; i++){
                //    if (blocks.blocks[i].x == nb.x &&
                //        blocks.blocks[i].y == nb.y &&
                //        blocks.blocks[i].z == nb.z 
                blocks.blocks.push(nb);
                break;
            }
        }
    },
    take_step: function(angle){
        let next = {x: cam.x + cam.step * Math.sin(zengine.to_rad(angle)),
                    y: cam.y + cam.step * Math.cos(zengine.to_rad(angle))};
        let blk = {x: Math.floor(next.x),
                   y: Math.floor(next.y)};
        if (blk.x < 0 || blk.y < 0 || blk.x > blocks.width || blk.y > blocks.height || !blocks.maze[blk.y][blk.x]){
            cam.x = next.x;
            cam.y = next.y;
        }
    },
    block: function(){
        return [{verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 0, y: 1, z: 0}], col: blocks.block_col, side: 'bt'},
                {verts: [{x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 1}, {x: 0, y: 0, z: 1}], col: blocks.block_col, side: 'lt'},
                {verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 0, z: 1}, {x: 0, y: 0, z: 1}], col: blocks.block_col, side: 'fr'},
                {verts: [{x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 1, y: 0, z: 1}], col: blocks.block_col, side: 'rt'},
                {verts: [{x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: blocks.block_col, side: 'bk'},
                {verts: [{x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: blocks.block_col, side: 'tp'}]
    }
}

blocks.key_funcs = {
    'w': ()=>{maze.take_step(cam.yaw)},
    'a': ()=>{maze.take_step(cam.yaw-90)},
    's': ()=>{maze.take_step(cam.yaw+180)},
    'd': ()=>{maze.take_step(cam.yaw+90)},
    'i': helpers.calibrate,
    'k': blocks.place,
    'o': ()=>{cam.z += cam.step},
    'l': ()=>{cam.z -= cam.step}
}
