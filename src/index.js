const regl = require("regl")();

// Calling regl() creates a new partially evaluated draw command
const draw = regl({

    // Shaders in regl are just strings.  You can use glslify or whatever you want
    // to define them.  No need to manually create shader objects.
    frag: `
      precision mediump float;

      varying vec2 uv;
      uniform float time;

      void main() {

        vec2 pos = uv; // origin is in center
    
        float r = sin(time + pos.x); 
        // x is left to right, why we see red moving from right to left think about us as a camera moving around
        // sin returns a number from -1 to 1, and colors are from 0 to 1, so it clips to no red half the time
        
        float g = sin(-time + pos.y * 20.); // higher frequency green stripes
        
        float b = mod(pos.x / pos.y,1.0);
        // when x is eual to y the colors will be brighter, mod repeats the space
        // mod is like a sawtooth function
        
        vec4 color = vec4(r,g,b,1);
        
        gl_FragColor = color;      
    }`,
  
      vert: `
      precision mediump float;
      attribute vec2 position;
      varying vec2 uv;
      void main () {
        uv = position;
        gl_Position = vec4(position, 0, 1);
      }`,
    // Here we define the vertex attributes for the above shader
    attributes: {
      // regl.buffer creates a new array buffer object
      position: regl.buffer([
        [-1, -1],   // no need to flatten nested arrays, regl automatically
        [1,  -1],
        [1, 1],
        [-1, 1]
      ])
      // regl automatically infers sane defaults for the vertex attribute pointers
    },
  
    uniforms: {time: 0},
    // This tells regl the number of vertices to draw in this command
    count: 4,
    primitive: "triangle fan"
  })
  
  // regl.frame() wraps requestAnimationFrame and also handles viewport changes
  regl.frame(({time}) => {
    // clear contents of the drawing buffer
    regl.clear({
      color: [0, 0, 0, 0],
      depth: 1
    })
  
    // draw a triangle using the command defined above
    draw({ time: new Date()})
  })
