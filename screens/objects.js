'use strict';

let objects = {
    cube: function(){
        let col = 'hsl(37, 100%, 60%)';
        return [{verts: [{x:0, y:0, z:0}, {x:0, y:1, z:0}, {x:0, y:1, z:1}, {x:0, y:0, z:1}], col: col, vect: {x:-1, y: 0, z: 0}},
                {verts: [{x:0, y:0, z:0}, {x:1, y:0, z:0}, {x:1, y:0, z:1}, {x:0, y:0, z:1}], col: col, vect: {x: 0, y:-1, z: 0}},
                {verts: [{x:0, y:0, z:0}, {x:1, y:0, z:0}, {x:1, y:1, z:0}, {x:0, y:1, z:0}], col: col, vect: {x: 0, y: 0, z:-1}},
                {verts: [{x:1, y:0, z:0}, {x:1, y:1, z:0}, {x:1, y:1, z:1}, {x:1, y:0, z:1}], col: col, vect: {x: 1, y: 0, z: 0}},
                {verts: [{x:0, y:1, z:0}, {x:1, y:1, z:0}, {x:1, y:1, z:1}, {x:0, y:1, z:1}], col: col, vect: {x: 0, y: 1, z: 0}},
                {verts: [{x:0, y:0, z:1}, {x:1, y:0, z:1}, {x:1, y:1, z:1}, {x:0, y:1, z:1}], col: col, vect: {x: 0, y: 0, z: 1}}]
    },
    grass: function(){
        return [{verts: [{x:0, y:0, z:1}, {x:1, y:0, z:1}, {x:1, y:1, z:1}, {x:0, y:1, z:1}], col: 'hsl(122, 44%, 49%)', vect: {x: 0, y: 0, z: 1}}];
    }
}
