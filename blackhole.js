export async function initBlackhole(canvasSelector) {
  const canvas = document.querySelector(canvasSelector);
  if (!canvas) {
    console.error("Blackhole Error: Canvas element not found with selector:", canvasSelector);
    return;
  }
  if (!window.THREE) {
    console.error("Blackhole Error: THREE.js not found on window object");
    return;
  }
  console.log("Blackhole: Initializing... Canvas found, THREE found.");
  const clock = new THREE.Clock();

  let shaders;
  try {
    shaders = await Promise.all([
      loadShader("assets/shaders/blackhole.vert.glsl"),
      loadShader("assets/shaders/blackhole.frag.glsl"),
    ]);
    console.log("Blackhole: Shaders loaded. Vertex length:", shaders[0].length, "Fragment length:", shaders[1].length);
    console.log("Blackhole: Vertex Shader Preview:", shaders[0].substring(0, 100));
  } catch (error) {
    console.warn("Shader load failed", error);
    return;
  }
  const [vertexShader, fragmentShader] = shaders;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    100
  );
  camera.position.z = 2.6;

  const geometry = new THREE.PlaneGeometry(2, 2); // Full screen quad
  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(canvas.offsetWidth, canvas.offsetHeight),
    },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false, // Important for background
  });

  material.onBeforeCompile = (shader) => {
    console.log("Blackhole: Compiling shader...");
  };

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const animate = () => {
    requestAnimationFrame(animate);
    uniforms.uTime.value += clock.getDelta();
    renderer.render(scene, camera);
  };
  animate();

  const handleScroll = () => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    uniforms.uScroll.value = window.scrollY / maxScroll || 0;
  };
  window.addEventListener("scroll", handleScroll);

  const handleResize = () => {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    uniforms.uResolution.value.set(width, height);
  };
  window.addEventListener("resize", handleResize);

  const handleMouseMove = (e) => {
    const x = e.clientX / window.innerWidth;
    const y = 1.0 - e.clientY / window.innerHeight; // Flip Y
    uniforms.uMouse.value.set(x, y);
  };
  window.addEventListener("mousemove", handleMouseMove);
}

async function loadShader(url) {
  const response = await fetch(url);
  return response.text();
}
