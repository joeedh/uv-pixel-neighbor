import {ShaderProgram} from './webgl.js';

const BasicShader = {
  vertex : `#version 300 es
precision highp float;

uniform mat4 projectionMatrix;

in vec2 co;
in vec2 uv;
in vec2 tri;

out vec2 vCo;
out vec2 vUv;
out vec2 vTri;

void main() {
  gl_Position = projectionMatrix * vec4(co, 0.0, 1.0);
  
  vCo = co;
  vUv = uv;
  vTri = tri;
}
`,

  fragment : `#version 300 es
precision highp float;

uniform sampler2D tex;

in vec2 vCo;
in vec2 vUv;
in vec2 vTri;

out vec4 fragColor;

void main() {
  //fragColor = vec4(vUv[0], vUv[1], 0.0, 1.0); 
  fragColor = texture(tex, vUv);
}
`,
  attributes : ["co", "uv", "tri"],
  uniforms : {

  },
  defines : {

  }
};

export const ShaderDef = {
  BasicShader
}

export const Shaders = {};

export function loadShaders(gl) {
  for (let k in ShaderDef) {
    let shader = Shaders[k] = ShaderProgram.fromDef(gl, ShaderDef[k]);
    shader.bind(gl);
  }
}
