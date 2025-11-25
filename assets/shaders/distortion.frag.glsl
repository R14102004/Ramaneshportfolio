varying vec2 vUv;
uniform float effectFactor;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D disp;
uniform float dispFactor;

void main() {
  vec2 uv = vUv;
  vec4 dispTex = texture2D(disp, uv);
  vec2 distortedPosition = vec2(
    uv.x + dispFactor * (dispTex.r * effectFactor),
    uv.y + dispFactor * (dispTex.g * effectFactor)
  );
  vec2 distortedPosition2 = vec2(
    uv.x - (1.0 - dispFactor) * (dispTex.r * effectFactor),
    uv.y - (1.0 - dispFactor) * (dispTex.g * effectFactor)
  );

  vec4 _texture1 = texture2D(texture1, distortedPosition);
  vec4 _texture2 = texture2D(texture2, distortedPosition2);
  gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
