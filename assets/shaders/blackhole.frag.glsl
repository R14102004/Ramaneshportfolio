precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

void main() {
  vec2 uv = vUv - 0.5;
  float radius = length(uv);
  float angle = atan(uv.y, uv.x);
  float swirl = sin(angle * 6.0 + uTime * 2.0);
  float turbulence = smoothstep(0.0, 1.0, swirl);
  float glow = smoothstep(0.4, 0.0, radius) * 0.8;
  float eventHorizon = smoothstep(0.12, 0.0, sdCircle(uv, 0.14));
  float accretion = smoothstep(0.25, 0.15, radius);
  float scrollGlow = smoothstep(0.4, 0.0, radius + uScroll * 0.2);

  vec3 coreColor = mix(vec3(0.0, 0.02, 0.08), vec3(0.0, 0.7, 0.9), glow);
  vec3 ring = mix(vec3(0.1, 0.0, 0.15), vec3(0.95, 0.15, 0.5), turbulence);
  vec3 color = coreColor + ring * accretion + scrollGlow * vec3(0.2, 0.9, 1.0);

  color += vec3(0.2, 0.0, 0.4) * eventHorizon;
  gl_FragColor = vec4(color, 0.85);
}
