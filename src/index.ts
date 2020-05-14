const regl = require("regl")();

const draw = regl({
    frag: require("./scene.frag").default,
    vert: `
      precision mediump float;
      attribute vec2 position;
      varying vec2 uv;
      void main () {
        uv = position;
        gl_Position = vec4(position, 0, 1);
      }`,
    attributes: {
        position: regl.buffer([
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1]
        ])
    },
    uniforms: { time: regl.prop('time') },
    count: 4,
    primitive: "triangle fan"
})

regl.frame(({ time }: any) => {
    regl.clear({
        color: [0, 0, 0, 0],
        depth: 1
    })
    draw({ time: time })
})
