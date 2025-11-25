const PARTICLE_COUNT = 12;

export function initCursor() {
  const cursor = document.querySelector("[data-cursor]");
  const trail = document.querySelector("[data-cursor-trail]");
  if (!cursor || !trail) return;

  const particles = createParticles(PARTICLE_COUNT);
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const current = { ...pointer };
  const trailPos = { ...pointer };
  let hoverScale = 1;
  let clickScale = 1;

  document.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  document.addEventListener("pointerdown", () => {
    clickScale = 0.7;
  });
  document.addEventListener("pointerup", () => {
    clickScale = 1;
  });

  document.querySelectorAll("a, button, .btn").forEach((interactive) => {
    interactive.addEventListener("mouseenter", () => {
      hoverScale = 1.35;
    });
    interactive.addEventListener("mouseleave", () => {
      hoverScale = 1;
    });
  });

  const render = () => {
    current.x += (pointer.x - current.x) * 0.25;
    current.y += (pointer.y - current.y) * 0.25;
    const glowScale = updateGlow(cursor, pointer);
    const scale = glowScale * hoverScale * clickScale;
    cursor.style.transform = `translate3d(${current.x - 7}px, ${
      current.y - 7
    }px, 0) scale(${scale})`;

    trailPos.x += (pointer.x - trailPos.x) * 0.1;
    trailPos.y += (pointer.y - trailPos.y) * 0.1;
    trail.style.transform = `translate3d(${trailPos.x - 18}px, ${
      trailPos.y - 18
    }px, 0)`;

    particles.forEach((particle, index) => {
      const delay = (index + 1) * 0.02;
      particle.x += (pointer.x - particle.x) * delay;
      particle.y += (pointer.y - particle.y) * delay;
      particle.el.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;
    });

    requestAnimationFrame(render);
  };
  render();
}

function createParticles(count) {
  return Array.from({ length: count }).map(() => {
    const el = document.createElement("span");
    el.className = "cursor-particle";
    document.body.appendChild(el);
    return {
      el,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  });
}

function updateGlow(cursor, pointer) {
  const canvas = document.querySelector("#blackhole-canvas");
  if (!canvas) return 1;
  const rect = canvas.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const distance = Math.hypot(pointer.x - cx, pointer.y - cy);
  const maxDistance = Math.max(rect.width, rect.height) / 2;
  const influence = Math.max(0, 1 - distance / maxDistance);
  cursor.style.boxShadow = `0 0 ${30 + influence * 40}px rgba(0, 246, 255, ${
    0.5 + influence * 0.5
  })`;
  return 1 + influence * 0.3;
}
