import * as Tone from "tone";

const regl = require("regl")();
const synth = new Tone.Synth().toMaster();

const distortion = new Tone.Distortion(.4).toMaster();

synth.connect(distortion);
//synth.triggerAttack(["C4", "E4", "G4", "B4"], "2n")
//synth.triggerRelease("2n");
/* var pattern = new Tone.Pattern(function(time, note){
 *   synth.triggerAttackRelease(note, .59);
 * }, ["C4", "G3", "D3"]); */

var pattern = new Tone.Pattern(function(time, note){
  synth.triggerAttackRelease(note, time);
}, ["E2", "Ab3", "B2", "Ab2", "B2", "E2"]);



// Calling regl() creates a new partially evaluated draw command
const draw = regl({

  // Shaders in regl are just strings.  You can use glslify or whatever you want
  // to define them.  No need to manually create shader objects.
  frag: require("./scene.frag").default,
  
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
  
  uniforms: {time: regl.prop('time')},
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
  draw({ time: time })
})

