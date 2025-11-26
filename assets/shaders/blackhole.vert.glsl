varying vec2 vUv;

void main() {
  vUv = uv;
  // Force full-screen quad by ignoring projection/modelview matrices
  // The plane geometry is 2x2, centered at 0, so positions are -1 to 1
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
