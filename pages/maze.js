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
    for (r = 0; r < maze_height * 2; r ++){
        r1 = [true];
        r2 = [true];
        for (c = 0; c < maze_width * 2; c++){
            r1.push(true,  true);
            r2.push(false, true);
        }
        maze.push(r1, r2);
    }
    maze[0][1] = maze[maze_width * 2][maze_height * 2 - 1] = false;
    let cellsInMaze = [[0,0]];
    let frontierCells = [[1,0], [0,1]];
    while (frontierCells.length){
        let fc = frontierCells[Math.floor(Math.random() * frontierCells.length)];
        //fc is a random frontier cell [x,y]
        let frontierAdjacents = [[fc[0]+1,fc[1]],[fc[0]-1,fc[1]],[fc[0],fc[1]+1], [fc[0],fc[1]-1]].
                                 filter(c => (cellsInMaze.some(o => (o[0] == c[0] && o[1] == c[1]))));
        let af = frontierAdjacents[Math.floor(Math.random() * frontierAdjacents.length)];
        maze[(fc[1] + af[1]) + 1][(fc[0] + af[0]) +1] = false;
        cellsInMaze.push([fc[0],fc[1]]);
        let frontierCells = [];
        for (i = 0; i < cellsInMaze.length; i++){
            let c = cellsInMaze[i];
            let neighbours = [[c[0]+1,c[1]], [c[0]-1,c[1]], [c[0],c[1]+1], [c[0],c[1]-1]].filter(c => (c[0] >= 0 && c[1] >= 0 && c[0] < maze_width && c[1] < maze_height));
            let validNeighbours = neighbours.filter(c => (!cellsInMaze.some(o => (o[0] == c[0] && o[1] == c[1])) && !frontierCells.some(o => (o[0] == c[0] && o[1] == c[1])))) ;
            frontierCells = frontierCells.concat(validNeighbours);
        }
    }
    return maze
}
