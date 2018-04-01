'use strict';

function gen_maze_world(){
    let maze = generate_maze();
    let world = [];
    for (let y = 0; y < maze_height * 2 + 1; y ++){
        for (let x = 0; x < maze_width * 2 + 1; x++){
            if (maze[y][x]){
                world = world.concat(block(block_col).map(f => ({
                            verts: f.verts.map(zengine.translate(x, y, 0)),
                            col: f.col})));
            }
        }
    }
    return world;
}

function generate_maze(){
    let maze = [];
    for (let r = 0; r < maze_height * 2; r ++){
        let r1 = [true];
        let r2 = [true];
        for (let c = 0; c < maze_width * 2; c++){
            r1.push(true,  true);
            r2.push(false, true);
        }
        maze.push(r1, r2);
    }
    maze[0][1] = maze[maze_width * 2][maze_height * 2 - 1] = false;
    let cells_in_maze = [[0,0]];
    var frontier_cells = [[1,0], [0,1]];
    while (frontier_cells.length){
        let fc = frontier_cells[Math.floor(Math.random() * frontier_cells.length)];
        //fc is a random frontier cell [x,y]
        let frontier_adjacents = [[fc[0]+1,fc[1]],[fc[0]-1,fc[1]],[fc[0],fc[1]+1], [fc[0],fc[1]-1]].
                                 filter(c => (cells_in_maze.some(o => (o[0] == c[0] && o[1] == c[1]))));
        let af = frontier_adjacents[Math.floor(Math.random() * frontier_adjacents.length)];
        maze[(fc[1] + af[1]) + 1][(fc[0] + af[0]) +1] = false;
        cells_in_maze.push([fc[0],fc[1]]);
        frontier_cells = [];
        for (let i = 0; i < cells_in_maze.length; i++){
            let c = cells_in_maze[i];
            let neighbours = [[c[0]+1,c[1]], [c[0]-1,c[1]], [c[0],c[1]+1], [c[0],c[1]-1]].filter(c => (c[0] >= 0 && c[1] >= 0 && c[0] < maze_width && c[1] < maze_height))
                              .filter(c => (!cells_in_maze.some(o => (o[0] == c[0] && o[1] == c[1])) && !frontier_cells.some(o => (o[0] == c[0] && o[1] == c[1])))) ;
            frontier_cells = frontier_cells.concat(neighbours);
        }
    }
    return maze;
}
