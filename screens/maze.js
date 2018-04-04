'use strict';

let maze = {
    init: function(){
        this.block_col = '#fc4';
        this.height =
        this.width = 8;
        this.gen_maze(); 
    },
    gen_world: function(){
        let world = [];
        for (let y = 0; y < this.height; y ++){
            for (let x = 0; x < this.width; x++){
                if (this.maze[y][x]){
                    world = world.concat(this.block().map(f => ({
                                verts: f.verts.map(zengine.translate(x, y, 0)),
                                col: f.col})));
                }
            }
        }
        return world;
    },
    gen_maze: function(){
        this.maze = [];
        let r1 = [true];
        let r2 = [true];
        for (let c = 0; c < this.width; c++){
            r1.push(true,  true);
            r2.push(false, true);
        }
        for (let r = 0; r < this.height; r ++){
            this.maze.push(r1.slice(0), r2.slice(0));
        }
        this.maze.push(r1.slice(0));
        this.maze[0][1] = this.maze[height * 2][width * 2 - 1] = false;
        //coordinates as [x, y] in maze
        let cells_in_maze = [[0,0]];
        var frontier_cells = [[1,0], [0,1]];
        while (frontier_cells.length){
            //fc = random frontier cell, adj_f = cell in maze adjacent to that frontier
            let fc = frontier_cells[Math.floor(Math.random() * frontier_cells.length)];
            let fc_adj = [[fc[0]+1,fc[1]],[fc[0]-1,fc[1]],[fc[0],fc[1]+1], [fc[0],fc[1]-1]].
                                     filter(c => (cells_in_maze.some(o => (o[0] == c[0] && o[1] == c[1]))));
            let adj_f = fc_adj[Math.floor(Math.random() * fc_adj.length)];
            this.maze[fc[1] + adj_f[1] + 1][fc[0] + adj_f[0] + 1] = false;
            cells_in_maze.push(fc);
            frontier_cells = [];
            for (let i = 0; i < cells_in_maze.length; i++){
                let c = cells_in_maze[i];
                let neighbours = [[c[0]+1,c[1]], [c[0]-1,c[1]], [c[0],c[1]+1], [c[0],c[1]-1]].filter(cc => 
                                   cc[0] >= 0 && cc[1] >= 0 && cc[0] < this.width && cc[1] < this.height &&
                                   !cells_in_maze.some(mc  => (mc[0] == cc[0] && mc[1] == cc[1])) && 
                                   !frontier_cells.some(fc => (fc[0] == cc[0] && fc[1] == cc[1])));
                frontier_cells = frontier_cells.concat(neighbours);
            }
        }
    },
    key_funcs: {
        'w': ()=>{this.take_step(cam.yaw)},
        'a': ()=>{this.take_step(cam.yaw-90)},
        's': ()=>{this.take_step(cam.yaw+180)},
        'd': ()=>{this.take_step(cam.yaw+90)},
        'i': ()=>{},
        'k': ()=>{},
        'o': ()=>{cam.z += cam.step},
        'l': ()=>{cam.z -= cam.step}
    },
    take_step: function(){
        let next = {x: cam.x + cam.step * Math.sin(zengine.to_rad(angle)),
                    y: cam.y + cam.step * Math.cos(zengine.to_rad(angle))};
        let blk = {x: Math.floor(next.x),
                   y: Math.floor(next.y)};
        if (blk.x < 0 || blk.y < 0 || blk.x > this.width || blk.y > this.height || !this.maze[blk.y][blk.x]){
            cam.x = next.x;
            cam.y = next.y;
        }
    },
    block: function(){
        return [{verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 0, y: 1, z: 0}], col: this.block_col},
                {verts: [{x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 1}, {x: 0, y: 0, z: 1}], col: this.block_col},
                {verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 0, z: 1}, {x: 0, y: 0, z: 1}], col: this.block_col},
                {verts: [{x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 1, y: 0, z: 1}], col: this.block_col},
                {verts: [{x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: this.block_col},
                {verts: [{x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: this.block_col}]
    }

}
