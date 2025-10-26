 /* Particles background (neon green dots + lines) */
    particlesJS("particles-js", {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 900 } },
        color: { value: "#00ff7f" },
        shape: { type: "circle" },
        opacity: { value: 0.45 },
        size: { value: 3, random: true },
        line_linked: { enable: true, color: "#00ff7f", opacity: 0.18, width: 1 },
        move: { enable: true, speed: 1.6, out_mode: "out" }
      },
      interactivity: {
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
        modes: { grab: { distance: 180, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });

     // Canvas globe (points + connecting lines)
    (function(){
      const canvas = document.getElementById('globeCanvas');
      const ctx = canvas.getContext('2d', { alpha: true });

      let DPR = Math.max(window.devicePixelRatio || 1, 1);
      let W, H;

      function resize() {
        // size according to element's displayed size (CSS)
        const rect = canvas.getBoundingClientRect();
        W = Math.max(300, Math.floor(rect.width));
        H = Math.max(200, Math.floor(rect.height));
        canvas.width = Math.floor(W * DPR);
        canvas.height = Math.floor(H * DPR);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }

      // Globe points
      let points = [];
      let R = 280;            // globe radius (will be scaled if needed)
      let POINTS = 700;      // number of globe points

      function initPoints(){
        points = [];
        // adapt radius to canvas smaller dimension
        const minSide = Math.min(W, H);
        const scale = Math.max(0.85, Math.min(1.25, minSide / 900));
        R = 260 * scale;
        POINTS = Math.round(650 * scale + 50);

        for(let i=0;i<POINTS;i++){
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = R * Math.sin(phi) * Math.cos(theta);
          const y = R * Math.sin(phi) * Math.sin(theta);
          const z = R * Math.cos(phi);
          points.push({ x, y, z });
        }
      }

      function project(p, angle){
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = p.x * cos - p.z * sin;
        const z = p.x * sin + p.z * cos;
        const y = p.y;
        // perspective
        const focal = Math.max(W, H) / 2.2;
        const pers = focal / (focal + z + R*0.6);
        return { x: W/2 + x * pers, y: H/2 + y * pers, z: z, vis: z > -R*0.6, s: pers };
      }

      let ang = 0;
      function draw(){
        ctx.clearRect(0,0,W,H);
        // subtle background glow ring for globe center
        const grd = ctx.createRadialGradient(W/2, H/2, R*0.15, W/2, H/2, R*1.3);
        grd.addColorStop(0, 'rgba(0,255,127,0.02)');
        grd.addColorStop(1, 'rgba(0,255,127,0.00)');
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,W,H);

        // draw lines (light)
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = 'rgba(0,255,127,0.10)';
        for(let i=0;i<points.length;i++){
          for(let j=i+1;j<points.length;j++){
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dz = points[i].z - points[j].z;
            const d = Math.hypot(dx,dy,dz);
            if(d < R * 0.22){ // threshold
              const a = project(points[i], ang);
              const b = project(points[j], ang);
              if(a.vis && b.vis){
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                // stroke alpha depending on proximity and perspective
                const alpha = (1 - d/(R*0.22)) * Math.min(a.s, b.s) * 0.65;
                ctx.strokeStyle = `rgba(0,255,127,${alpha.toFixed(3)})`;
                ctx.stroke();
              }
            }
          }
        }

        // draw points (front brighter)
        for(let p of points){
          const pr = project(p, ang);
          if(!pr.vis) continue;
          const size = Math.max(1, 2.4 * pr.s);
          ctx.beginPath();
          ctx.fillStyle = '#00ff99';
          ctx.globalAlpha = 0.95 * Math.min(1, pr.s+0.1);
          ctx.arc(pr.x, pr.y, size, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // optional orbiting smaller asteroids (random tiny dots across canvas)
        // draw a few moving dots around globe for depth
        for(let i=0;i<asteroids.length;i++){
          const a = asteroids[i];
          a.ang += a.speed;
          const sx = W/2 + Math.cos(a.ang) * (R*1.6 + a.dist);
          const sy = H/2 + Math.sin(a.ang*0.9) * (R*1.1 + a.distY);
          ctx.beginPath();
          ctx.fillStyle = 'rgba(0,255,127,0.6)';
          ctx.arc(sx, sy, a.sz, 0, Math.PI*2);
          ctx.fill();
        }

        ang += 0.0025; // rotation speed
        requestAnimationFrame(draw);
      }

      // small asteroids
      let asteroids = [];
      function initAsteroids(){
        asteroids = [];
        const count = 28;
        for(let i=0;i<count;i++){
          asteroids.push({
            ang: Math.random()*Math.PI*2,
            dist: (Math.random()*0.6 + 0.2)*R,
            distY: (Math.random()*0.5 + 0.1)*R,
            speed: (Math.random()*0.004 + 0.0012)*(Math.random()<0.5?-1:1),
            sz: Math.random()*2 + 0.7
          });
        }
      }

      // initialize sizes and points
      function start(){
        resize();
        initPoints();
        initAsteroids();
        draw();
      }

      // resize handling: measure computed size of canvas element
      function resizeHandler(){
        resize();
        initPoints();
      }

      window.addEventListener('resize', () => {
        // debounce small delays
        clearTimeout(window._globe_resize);
        window._globe_resize = setTimeout(resizeHandler, 120);
      });

      // initial setup after DOM
      requestAnimationFrame(()=>{ start(); });

    })();