varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  vec3 transformed = position;
  transformed.z += sin(position.x * 4.0) * 0.02;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
