/* ==========================================================================
   MANGOZTEEN - HIGH-END INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 1. Mobile Menu Toggling
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        const isOpened = navMenu.classList.contains("open");
        icon.setAttribute("data-lucide", isOpened ? "x" : "menu");
        lucide.createIcons();
      }
    });

    // Close menu when clicking nav link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        const icon = mobileToggle.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "menu");
          lucide.createIcons();
        }
      });
    });
  }

  // 2. Active Nav Link Tracking on Scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // 3. IST (Indian Standard Time) Clock Node Widget
  const clockElement = document.getElementById("ist-clock");
  if (clockElement) {
    const updateISTClock = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.format(new Date());
      clockElement.textContent = `${parts} (IST)`;
    };
    updateISTClock();
    setInterval(updateISTClock, 1000);
  }

  // 4. Spotlight Glowing Shimmer (Mouse Tracking Coordinates)
  const spotlightCards = document.querySelectorAll(".glow-spotlight");
  spotlightCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // 5. Scroll Reveal Intersection Observer
  const scrollReveals = document.querySelectorAll(".scroll-reveal");
  if (scrollReveals.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollReveals.forEach(element => {
      revealObserver.observe(element);
    });
  }

  // 6. Operational Pillars Metrics Drawers
  const setupDrawer = (triggerId, drawerId) => {
    const trigger = document.getElementById(triggerId);
    const drawer = document.getElementById(drawerId);
    if (trigger && drawer) {
      trigger.addEventListener("click", () => {
        trigger.classList.toggle("active");
        const isOpen = trigger.classList.contains("active");
        const drawerInner = drawer.querySelector(".drawer-inner");

        if (isOpen) {
          drawer.style.height = `${drawerInner.scrollHeight + 30}px`;
          trigger.querySelector("span").textContent = "Hide Technical Metrics";
        } else {
          drawer.style.height = "0";
          trigger.querySelector("span").textContent = "View Technical Metrics";
        }
      });
    }
  };
  setupDrawer("ai-pillar-expand", "ai-details-drawer");
  setupDrawer("fintech-pillar-expand", "fintech-details-drawer");

  // 7. Golden AI Constellation Canvas Engine (60fps)
  const canvas = document.getElementById("hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const maxParticles = 65;

    // Mouse properties
    let mouse = {
      x: null,
      y: null,
      radius: 140
    };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    };
    window.addEventListener("resize", resizeCanvas);

    // Particle constructor
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Bounce off bounds
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse hover interaction: attract/cluster
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Calculate clustering vector
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxForce = 0.8;
            const force = (mouse.radius - distance) / mouse.radius;

            // Gently cluster particles toward mouse position
            this.x += forceDirectionX * force * maxForce;
            this.y += forceDirectionY * force * maxForce;
          }
        }

        // Standard movement drift
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Populate particles
    const initParticles = () => {
      particlesArray = [];
      for (let i = 0; i < maxParticles; i++) {
        let size = Math.random() * 1.5 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = (Math.random() - 0.5) * 0.45;
        let directionY = (Math.random() - 0.5) * 0.45;
        // Luxury gold shades
        const golds = ["rgba(212, 175, 55, 0.45)", "rgba(249, 232, 162, 0.5)", "rgba(142, 109, 28, 0.45)"];
        let color = golds[Math.floor(Math.random() * golds.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    // Connect constellation lines
    const connectParticles = () => {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            opacityValue = (1 - (distance / 110)) * 0.16;
            ctx.strokeStyle = `rgba(212, 175, 55, ${opacityValue})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation Loop
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    };

    // Kickstart
    resizeCanvas();
    animateParticles();
  }

  // 8. Fintech Settlement Ledger Switcher
  const ledgerButtons = document.querySelectorAll(".ledger-btn");
  const nodeSource = document.getElementById("node-source");
  const nodeEngine = document.getElementById("node-engine");
  const nodeDest = document.getElementById("node-dest");
  const destLabel = document.getElementById("ledger-dest-label");
  const destStatus = document.getElementById("ledger-dest-status");
  const dynamicVal = document.getElementById("ledger-dynamic-value");
  const pulse1 = document.getElementById("flow-pulse-1");
  const pulse2 = document.getElementById("flow-pulse-2");

  if (ledgerButtons.length > 0) {
    const flows = {
      b2b: {
        sourceName: "Enterprise Core",
        destName: "Corporate Vault Rails",
        status: "SETTLED (AES-256)",
        value: "₹2,45,800 / sec",
        speed: "2s",
        bg: "rgba(212, 175, 55, 0.15)"
      },
      split: {
        sourceName: "Fresqu Merchant",
        destName: "Multi-Vendor Wallets",
        status: "SPLIT DISBURSED",
        value: "₹84,520 / sec",
        speed: "0.8s",
        bg: "rgba(0, 230, 118, 0.15)"
      },
      decentral: {
        sourceName: "Treasury Nodes",
        destName: "Stability Pools",
        status: "LIQUIDITY SECURED",
        value: "₹9,12,400 / sec",
        speed: "3s",
        bg: "rgba(142, 109, 28, 0.15)"
      }
    };

    ledgerButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Toggle Active button
        ledgerButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedFlow = btn.getAttribute("data-flow");
        const data = flows[selectedFlow];

        // Animate nodes pulsing
        nodeSource.classList.add("active");
        nodeDest.classList.add("active");

        // Update values with fade
        destLabel.style.opacity = 0;
        destStatus.style.opacity = 0;
        dynamicVal.style.opacity = 0;

        setTimeout(() => {
          nodeSource.querySelector(".node-label").textContent = data.sourceName;
          destLabel.textContent = data.destName;
          destStatus.textContent = data.status;
          dynamicVal.textContent = data.value;

          // Modify connector animation speed
          if (pulse1 && pulse2) {
            pulse1.style.animationDuration = data.speed;
            pulse2.style.animationDuration = data.speed;
          }

          destLabel.style.opacity = 1;
          destStatus.style.opacity = 1;
          dynamicVal.style.opacity = 1;
        }, 300);
      });
    });
  }

  // 9. Interactive "Fresqu" Quick-Commerce Pathfinding Simulator
  const btnRunSim = document.getElementById("btn-run-simulation");
  const btnResetSim = document.getElementById("btn-reset-simulation");
  const pathDelayed = document.getElementById("path-delayed");
  const pathOptimized = document.getElementById("path-optimized");
  const statusText = document.getElementById("sim-status-text");
  const statTime = document.getElementById("sim-stat-time");
  const statRisk = document.getElementById("sim-stat-risk");
  const statSavings = document.getElementById("sim-stat-savings");
  const barrierA = document.getElementById("barrier-a");
  const barrierB = document.getElementById("barrier-b");

  if (btnRunSim) {
    let animationTimer = null;
    let pathInterval = null;

    const generatePathCoordinates = () => {
      // Coordinates mapping relative to simulated container sizing
      const parent = document.getElementById("simulation-map");
      if (!parent) return;

      const w = parent.offsetWidth;
      const h = parent.offsetHeight;

      // Merchant: left: 10%, top: 75% -> approx
      const mX = w * 0.12 + 20;
      const mY = h * 0.75 + 20;

      // Customer: left: 85%, top: 20% -> approx
      const cX = w * 0.85 + 20;
      const cY = h * 0.20 + 20;

      // Delayed direct path (colliding with Swardj round traffic & Railway block)
      const delayedD = `M ${mX} ${mY} L ${w * 0.45 + 18} ${h * 0.60 + 18} L ${w * 0.30 + 18} ${h * 0.30 + 18} L ${cX} ${cY}`;

      // AI Optimized route (curving elegantly bypassing blocks)
      const optD = `M ${mX} ${mY} Q ${w * 0.15} ${h * 0.30}, ${w * 0.50} ${h * 0.15} T ${cX} ${cY}`;

      pathDelayed.setAttribute("d", delayedD);
      pathOptimized.setAttribute("d", optD);
    };

    // Calculate on init & resize
    window.addEventListener("resize", generatePathCoordinates);
    generatePathCoordinates();

    btnRunSim.addEventListener("click", () => {
      // Clear existing
      clearInterval(pathInterval);
      clearTimeout(animationTimer);

      btnRunSim.disabled = true;
      statusText.textContent = "COMPUTING OPTIMAL PATH...";
      statusText.style.color = "var(--gold-primary)";

      // Draw barriers red alerts flashing
      barrierA.classList.add("barrier-active");
      barrierB.classList.add("barrier-active");

      // Phase 1: Draw regular delayed trajectory
      pathDelayed.style.strokeDasharray = "5 5";
      pathDelayed.style.opacity = "0.7";

      // Phase 2: Compute AI optimal route path after 1s delay
      animationTimer = setTimeout(() => {
        statusText.textContent = "ROUTING GENERATED. EXECUTING...";
        statusText.style.color = "#00E676";

        pathOptimized.style.strokeDashoffset = "1000";
        pathOptimized.style.strokeDasharray = "1000";
        pathOptimized.style.transition = "stroke-dashoffset 2.5s ease-in-out";

        // Force reflow
        pathOptimized.getBoundingClientRect();
        pathOptimized.style.strokeDashoffset = "0";

        // De-active obstacles in timeline
        barrierA.classList.remove("barrier-active");
        barrierB.classList.remove("barrier-active");

        // Tick Up Metrics
        let time = 45;
        let risk = 24.8;
        let savings = 0;

        pathInterval = setInterval(() => {
          if (time > 12) time -= 1.5;
          if (risk > 0.8) risk -= 1.1;
          if (savings < 32.4) savings += 1.5;

          statTime.textContent = `${Math.max(12, Math.round(time))} mins`;
          statRisk.textContent = `${Math.max(0.8, risk.toFixed(1))}%`;
          statSavings.textContent = `${Math.min(32.4, savings.toFixed(1))}%`;

          if (time <= 12 && risk <= 0.8 && savings >= 32.4) {
            clearInterval(pathInterval);
            statusText.textContent = "DELIVERY OPTIMIZED & COMPLETED ✅";
            btnRunSim.disabled = false;
          }
        }, 100);

      }, 1000);
    });

    btnResetSim.addEventListener("click", () => {
      clearInterval(pathInterval);
      clearTimeout(animationTimer);

      btnRunSim.disabled = false;
      pathDelayed.style.opacity = "0";
      pathOptimized.style.strokeDasharray = "none";
      pathOptimized.style.strokeDashoffset = "0";
      pathOptimized.style.transition = "none";

      barrierA.classList.add("barrier-active");
      barrierB.classList.add("barrier-active");

      statusText.textContent = "SYSTEM STANDBY";
      statusText.style.color = "var(--text-dark)";
      statTime.textContent = "-- mins";
      statRisk.textContent = "--%";
      statSavings.textContent = "--%";

      // Re-trigger layout coordinates
      generatePathCoordinates();
    });
  }

  // 10. Geographic Scaler Map Hover Hooks
  const mapNodes = document.querySelectorAll(".map-node-trigger");
  const mapTitle = document.getElementById("map-info-title");
  const mapDesc = document.getElementById("map-info-desc");
  const mapStatus = document.getElementById("map-info-status");

  if (mapNodes.length > 0) {
    const nodeDetails = {
      kochi: {
        title: "KOCHI SCALING NODE",
        desc: "High-volume commerce interfaces, multi-vendor B2C payouts clearing daily logs. Directly connected to Thrissur models.",
        status: "ACTIVE INTEGRATION ROUTE"
      },
      kozhikode: {
        title: "KOZHIKODE DISTRIBUTION UNIT",
        desc: "Hyper-local demand routing compiling nodes for Malabar merchant structures. Active since Q3 2024.",
        status: "OPERATIONAL NODE"
      },
      blr: {
        title: "BANGALORE FINANCIAL NODE",
        desc: "Strategic decentralized rails integration, payment stability compliance layers, and corporate wealth components.",
        status: "TESTNET STAGE DEPLOYMENT"
      },
      mumbai: {
        title: "MUMBAI MERCHANTS DESK",
        desc: "Dedicated enterprise wealth settlement checks, treasury pathways, and corporate payment tunnels planning stage.",
        status: "STRATEGIC TARGETING"
      }
    };

    mapNodes.forEach(node => {
      node.addEventListener("mouseenter", () => {
        const activeNode = node.getAttribute("data-node");
        const details = nodeDetails[activeNode];

        if (details) {
          mapTitle.textContent = details.title;
          mapDesc.textContent = details.desc;
          mapStatus.textContent = details.status;

          if (activeNode === "blr" || activeNode === "mumbai") {
            mapStatus.style.color = "var(--gold-amber)";
            mapStatus.style.borderColor = "var(--gold-border)";
          } else {
            mapStatus.style.color = "#00E676";
            mapStatus.style.borderColor = "rgba(0, 230, 118, 0.3)";
          }
        }
      });

      node.addEventListener("mouseleave", () => {
        // Return to standard Thrissur HQ info
        mapTitle.textContent = "THRISSUR HEADQUARTERS";
        mapDesc.textContent = "Poothole corporate node active. Core routing calculations, model compiling, and partnership settlement base.";
        mapStatus.textContent = "OPERATIONAL FOUNDATION";
        mapStatus.style.color = "#00E676";
        mapStatus.style.borderColor = "rgba(0, 230, 118, 0.3)";
      });
    });
  }

  // 11. Founding Journey Timeline Scrolling / Clicking Highlight
  const timelineSteps = document.querySelectorAll(".timeline-step");
  timelineSteps.forEach(step => {
    step.addEventListener("click", () => {
      timelineSteps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");
    });
  });

  // 12. Strategic Inquiry Form Handling (FormDock Integration Tunnel)
  const inquiryForm = document.getElementById("inquiry-form");
  const formSubmitBtn = document.getElementById("form-submit-btn");
  const formResult = document.getElementById("form-result");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Disable button, show loading feedback
      formSubmitBtn.disabled = true;
      const originalBtnText = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = `<span>Processing Transmission...</span> <i data-lucide="loader" class="btn-icon pulse-gold"></i>`;
      lucide.createIcons();

      // Hide previous outputs
      formResult.className = "form-result-box hidden";
      formResult.innerHTML = "";

      // Gather input data
      const nameVal = document.getElementById("input-name").value.trim();
      const emailVal = document.getElementById("input-email").value.trim();
      const interestVal = document.getElementById("select-interest").value;
      const messageVal = document.getElementById("input-message").value.trim();

      const payload = {
        project_api_key: "95be6991c5602e0f5a3d0a113c48ec993333de94cb7efe32",
        fields: {
          name: nameVal,
          email: emailVal,
          interest: interestVal,
          message: messageVal
        },
        metadata: {
          page_url: window.location.href,
          referrer: document.referrer || "",
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      };

      try {
        // Secure submit endpoint to FormDock gateway
        const response = await fetch("https://api.formdock.in/api/forms/submit/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          // Success Response Layout
          formResult.className = "form-result-box success animate-fade-in";
          formResult.innerHTML = `
            <i data-lucide="check-circle" class="check-icon" style="color: #00E676; width: 22px; height: 22px;"></i>
            <div>
              <strong>Secure Connection Established</strong><br>
              Thank you for contacting Mangozteen. Your strategic inquiry has been successfully transmitted and logged in our system. Our executive team will analyze your requirements and coordinate a response within 24 business hours.
            </div>
          `;
          inquiryForm.reset();
        } else {
          // Failed Gateway Response Layout
          formResult.className = "form-result-box error animate-fade-in";
          formResult.innerHTML = `
            <i data-lucide="alert-triangle" class="check-icon" style="color: #F44336; width: 22px; height: 22px;"></i>
            <div>
              <strong>Transmission Pipeline Interrupted</strong><br>
              We apologize, but we could not establish a connection to our transaction gateway at this time. Please verify your internet settings and resubmit, or reach us directly at <strong>inquiries@mangozteen.com</strong>.
            </div>
          `;
        }
      } catch (error) {
        // Network Error Layout
        formResult.className = "form-result-box error animate-fade-in";
        formResult.innerHTML = `
          <i data-lucide="wifi-off" class="check-icon" style="color: #F44336; width: 22px; height: 22px;"></i>
          <div>
            <strong>Network Tunnel Blocked</strong><br>
            A network exception occurred while routing your submission data. Please verify your network channels and try again, or forward your query to <strong>support@mangozteen.com</strong>.
          </div>
        `;
      } finally {
        // Re-enable button and reset layout icons
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnText;
        lucide.createIcons();
      }
    });
  }
});
