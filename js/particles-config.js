  /* Neon Dark Green Particles */
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#00ff7f" },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: 3, random: true },
      line_linked: { enable: true, color: "#00ff7f", opacity: 0.4, width: 1 },
      move: { enable: true, speed: 2, out_mode: "out" }
    },
    interactivity: {
      events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
      modes: { grab: { distance: 200, line_linked: { opacity: 0.6 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  });