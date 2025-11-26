import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";
window.THREE = THREE;

import { initConstellation } from "./constellation.js";
import { initCursor } from "./cursor.js";
import { initTransitions } from "./transitions.js";

if (window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
}

const page = document.body.dataset.page;
const isMobile = window.matchMedia("(max-width: 768px)").matches;
let lenisInstance = null;

const projectMap = {
  gravity: {
    title: "Gravity Commerce",
    description:
      "Modular commerce engine with custom WebGL product try-ons and AI-powered bundling.",
    highlights: [
      "Three.js blackhole landing hero",
      "Composable checkout built with headless Shopify",
      "Marketing automation sync via Segment + Braze",
    ],
    links: {
      live: "https://example.com/gravity-commerce",
      case: "https://example.com/gravity-case",
    },
  },
  pulse: {
    title: "PulseOS",
    description:
      "Realtime telemetry dashboard for wellness clinics with bite-sized, gamified interventions.",
    highlights: [
      "gRPC streaming for vitals & alerts",
      "Web Animations API micro-interactions",
      "HIPAA-grade RBAC + audit trails",
    ],
    links: {
      live: "https://example.com/pulseos",
      case: "https://example.com/pulseos-case",
    },
  },
  orbit: {
    title: "Orbit Events",
    description:
      "Immersive event funnel for hybrid conferences, pairing cinematic storytelling with CRM scoring.",
    highlights: [
      "Three-scene onboarding narrative",
      "HubSpot + Webflow automation hand-off",
      "Demand gen dashboards with Looker",
    ],
    links: {
      live: "https://example.com/orbit-events",
      case: "https://example.com/orbit-case",
    },
  },
};

const gradientSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
    <defs>
      <radialGradient id="g" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stop-color="#00f6ff" stop-opacity="0.9" />
        <stop offset="65%" stop-color="#081523" />
      </radialGradient>
    </defs>
    <rect fill="#030810" width="600" height="400" />
    <ellipse cx="300" cy="200" rx="220" ry="160" fill="url(#g)" />
  </svg>
`;
const svgGradient = `data:image/svg+xml,${encodeURIComponent(gradientSVG)}`;

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector("[data-loader]");
  requestAnimationFrame(() => loader?.classList.add("is-hidden"));

  initLenis();
  initNavigator();
  initCursor();
  initTransitions();
  initButtons();
  initDistortLinks();
  initModal();
  initSkillProgress();
  initFloatingCards();
  initHoverDistortion();
  initProjectSpace();
  initTimelineReveal();
  initContactYear();
  initAnchorScroll();
  initProjectTilt();

  if (!isMobile) {
    initConstellation("#blackhole-canvas");
  }
});

function initLenis() {
  if (!window.Lenis) return;
  lenisInstance = new window.Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function initAnchorScroll() {
  if (!lenisInstance) return;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const element = document.querySelector(targetId);
      if (!element) return;
      event.preventDefault();
      lenisInstance.scrollTo(element, { offset: -80 });
    });
  });
}

function initNavigator() {
  const menuBtn = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("is-open"))
  );
}

function initButtons() {
  const magnets = document.querySelectorAll(".btn");
  magnets.forEach((btn) => {
    btn.addEventListener("mousemove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

function initDistortLinks() {
  if (!window.gsap) return;
  document.querySelectorAll("[data-distort]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.classList.add("is-hovered");
      window.gsap.to(el, {
        "--distort": 1,
        duration: 0.5,
        ease: "power2.out",
      });
    });
    el.addEventListener("mouseleave", () => {
      el.classList.remove("is-hovered");
      window.gsap.to(el, {
        "--distort": 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    });
  });
}

function initModal() {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;

  const title = modal.querySelector("[data-modal-title]");
  const description = modal.querySelector("[data-modal-description]");
  const list = modal.querySelector("[data-modal-highlights]");
  const closeBtn = modal.querySelector("[data-modal-close]");
  const actionLinks = modal.querySelectorAll(".modal-actions a");

  const openModal = (id) => {
    const data = projectMap[id];
    if (!data) return;
    title.textContent = data.title;
    description.textContent = data.description;
    list.innerHTML = data.highlights
      .map((item) => `<li>${item}</li>`)
      .join("");
    if (actionLinks.length >= 2) {
      actionLinks[0].href = data.links?.live || "#";
      actionLinks[1].href = data.links?.case || "#";
    }
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-modal-trigger]").forEach((btn) =>
    btn.addEventListener("click", () => openModal(btn.dataset.modalTrigger))
  );
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  closeBtn?.addEventListener("click", closeModal);
  document.addEventListener("keyup", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function initSkillProgress() {
  if (page !== "skills" || !window.gsap) return;
  window.gsap.utils.toArray(".skill-bars li").forEach((item) => {
    const value = Number(item.dataset.progress || 0) / 100;
    const progress = item.querySelector(".progress");
    window.gsap.fromTo(
      progress,
      { "--progress": 0 },
      {
        "--progress": value,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        },
      }
    );
  });

  const circumference = 2 * Math.PI * 52;
  window.gsap.utils.toArray(".skill-orbit").forEach((orbit) => {
    const value = Number(orbit.dataset.progress || 0) / 100;
    const meter = orbit.querySelector(".meter");
    if (!meter) return;
    window.gsap.fromTo(
      meter,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: circumference * (1 - value),
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: orbit,
          start: "top 80%",
        },
      }
    );
  });
}

function initFloatingCards() {
  if (!window.gsap) return;
  window.gsap.to("[data-float]", {
    yPercent: -5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    duration: 2.8,
    stagger: 0.3,
  });
}

function initHoverDistortion() {
  if (!window.hoverEffect || isMobile) return;
  fetch("assets/shaders/distortion.frag.glsl")
    .then((response) => response.text())
    .then((fragmentShader) => {
      document.querySelectorAll("[data-hover-visual]").forEach((target) => {
        new window.hoverEffect({
          parent: target,
          intensity: 0.25,
          image1: svgGradient,
          image2: svgGradient,
          displacementImage:
            "https://uploads-ssl.webflow.com/5f88ccd7d311f7680df6c114/5f88ccd7f6ed82ed0d327ef9_displacement.png",
          fragment: fragmentShader,
        });
      });
    })
    .catch(() => { });
}

function initProjectSpace() {
  if (page !== "projects" || !window.THREE) return;
  const canvas = document.querySelector("#project-space");
  if (!canvas) return;

  const renderer = new window.THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || canvas.parentElement?.clientWidth || 600;
  const height = rect.height || 360;
  renderer.setSize(width, height);
  const scene = new window.THREE.Scene();
  const camera = new window.THREE.PerspectiveCamera(
    55,
    width / height,
    0.1,
    1000
  );
  camera.position.z = 6;

  const geometry = new window.THREE.BufferGeometry();
  const count = isMobile ? 400 : 900;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 12;
  }
  geometry.setAttribute(
    "position",
    new window.THREE.BufferAttribute(positions, 3)
  );
  const material = new window.THREE.PointsMaterial({
    color: 0x00f6ff,
    size: 0.035,
    transparent: true,
    opacity: 0.8,
  });
  const points = new window.THREE.Points(geometry, material);
  scene.add(points);

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0008;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const bounds = canvas.getBoundingClientRect();
    const nextWidth = bounds.width || canvas.parentElement?.clientWidth || 600;
    const nextHeight = bounds.height || 360;
    renderer.setSize(nextWidth, nextHeight);
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
  });
}

function initTimelineReveal() {
  if (!window.gsap) return;
  window.gsap.utils
    .toArray(".glass-card, .glass-panel")
    .forEach((card, index) => {
      window.gsap.from(card, {
        opacity: 0,
        y: 40,
        delay: index * 0.05,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
}

function initProjectTilt() {
  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      card.style.transform = `rotateY(${x}deg) rotateX(${y * -1}deg)`;
      card.classList.add("is-tilting");
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.classList.remove("is-tilting");
    });
  });
}

function initContactYear() {
  const yearTarget = document.querySelector("[data-year]");
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
}
