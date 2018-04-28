screens
=======

Each screen is a `.js` file containing an object which must have the following attributes:

Key | Value
----|------
`init` | function called once to reset the state
`gen_world` | funciton that should return a valid [zengine](http://github.com/roadkillcat/zengine) world
`key_funcs` | object where each key is a function to be called when that key is pressed

For example:

```javascript
example_screen = {
    init: function(){
        setup_positions();
        generate_some_stuff_for_later();
    },
    gen_world: function(){
        return [{verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 0, y: 1, z: 0}], col: 'pink'},
                {verts: [{x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 1}, {x: 0, y: 0, z: 1}], col: 'pink'},
                {verts: [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 0, z: 1}, {x: 0, y: 0, z: 1}], col: 'pink'},
                {verts: [{x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 1, y: 0, z: 1}], col: 'pink'},
                {verts: [{x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: 'pink'},
                {verts: [{x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}], col: 'pink'}]
    },
    key_funcs: {
        'w': ()=>{console.log('w pressed!'},
        'a': ()=>{},
        's': ()=>{},
        'd': ()=>{},
        'i': ()=>{},
        'k': ()=>{},
        'o': ()=>{},
        'l': ()=>{}
    }
}
```
