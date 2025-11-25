export function initTransitions() {
  if (!window.gsap) return;
  window.gsap.fromTo(
    "main",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
  );

  document.querySelectorAll('[data-transition="page"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      event.preventDefault();
      window.gsap.to("main", {
        opacity: 0,
        y: -24,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          window.location.href = href;
        },
      });
    });
  });
}
