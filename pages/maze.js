'use strict';

let maze = { 
    gen_maze_world: function(maze, col){
        let world = [];
        for (let y = 0; y < maze.length; y ++){
            for (let x = 0; x < maze[0].length * 2 + 1; x++){
                if (maze[y][x]){
                    world = world.concat(block(col).map(f => ({
                                verts: f.verts.map(zengine.translate(x, y, 0)),
                                col: f.col})));
                }
            }
        }
        return world;
    },
    generate_maze: function(width, height){
        let maze = [];
        let r1 = [true];
        let r2 = [true];
        for (let c = 0; c < width; c++){
            r1.push(true,  true);
            r2.push(false, true);
        }
        for (let r = 0; r < height; r ++){
            maze.push(r1.slice(0), r2.slice(0));
        }
        maze.push(r1.slice(0));
        maze[0][1] = maze[height * 2][width * 2 - 1] = false;
        let cells_in_maze = [[0,0]];
        var frontier_cells = [[1,0], [0,1]];
        while (frontier_cells.length){
            //fc = random frontier cell, adj_f = cell in maze adjacent to that frontier
            let fc = frontier_cells[Math.floor(Math.random() * frontier_cells.length)];
            let fc_adj = [[fc[0]+1,fc[1]],[fc[0]-1,fc[1]],[fc[0],fc[1]+1], [fc[0],fc[1]-1]].
                                     filter(c => (cells_in_maze.some(o => (o[0] == c[0] && o[1] == c[1]))));
            let adj_f = fc_adj[Math.floor(Math.random() * fc_adj.length)];
            maze[fc[1] + adj_f[1] + 1][fc[0] + adj_f[0] + 1] = false;
            cells_in_maze.push(fc);
            frontier_cells = [];
            for (let i = 0; i < cells_in_maze.length; i++){
                let c = cells_in_maze[i];
                let neighbours = [[c[0]+1,c[1]], [c[0]-1,c[1]], [c[0],c[1]+1], [c[0],c[1]-1]].filter(cc => 
                                   cc[0] >= 0 && cc[1] >= 0 && cc[0] < width && cc[1] < height &&
                                   !cells_in_maze.some(mc  => (mc[0] == cc[0] && mc[1] == cc[1])) && 
                                   !frontier_cells.some(fc => (fc[0] == cc[0] && fc[1] == cc[1])));
                frontier_cells = frontier_cells.concat(neighbours);
            }
        }
        return maze;
    }
}
