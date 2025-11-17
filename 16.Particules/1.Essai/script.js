// ===========================
// GESTION NAVIGATION
// ===========================

document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // GESTION DU MENU BURGER
    // ===========================
    const burger = document.getElementById("burger-menu");
    const navUl = document.querySelector("#nav-menu");

    if (burger && navUl) {
        // Au clic sur le burger, ouvrir/fermer le menu
        burger.addEventListener("click", () => {
            navUl.classList.toggle("open");
            burger.src = navUl.classList.contains("open")
                ? "./assets/close.png"
                : "./assets/burger.png";
        });

        // Ferme le menu si on repasse en mode desktop lors d'un redimensionnement
        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                navUl.classList.remove("open");
                burger.src = "./assets/burger.png";
            }
        });

        // Fermer le menu quand on clique sur un lien en mode mobile
        // Sélectionner tous les liens sauf les dropdown-toggle
        const navLinks = navUl.querySelectorAll("a:not(.dropdown-toggle)");
        // Ajouter aussi tous les liens dans les dropdown-menu
        const dropdownLinks = navUl.querySelectorAll(".dropdown-menu a");

        // Combiner tous les liens
        const allLinks = [...navLinks, ...dropdownLinks];

        allLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 820) {
                    navUl.classList.remove("open");
                    burger.src = "./assets/burger.png";
                }
            });
        });
    } else {
        console.error("L'élément burger ou nav n'a pas été trouvé");
    }

    // ===========================
    // GESTION DES DROPDOWNS
    // ===========================
    const dropdowns = document.querySelectorAll(".dropdown");

    // Fonction pour fermer tous les dropdowns
    function closeAllDropdowns() {
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("active");
        });
    }

    // Gestion des événements pour chaque dropdown
    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");

        // Gestion du clic sur le bouton toggle
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Si ce dropdown est déjà actif, le fermer
            if (dropdown.classList.contains("active")) {
                closeAllDropdowns();
                return;
            }

            // Fermer tous les autres dropdowns
            closeAllDropdowns();

            // Activer ce dropdown
            dropdown.classList.add("active");
        });

        // Empêcher la fermeture quand on clique à l'intérieur du dropdown
        const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        if (dropdownMenu) {
            dropdownMenu.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }
    });

    // Fermer les dropdowns en cliquant ailleurs ou sur l'overlay mobile
    document.addEventListener("click", function (e) {
        // Si on clique sur l'overlay mobile (::before pseudo-element)
        const activeDropdown = document.querySelector(".dropdown.active");
        if (activeDropdown && window.innerWidth <= 820) {
            const dropdownMenu = activeDropdown.querySelector(".dropdown-menu");
            if (
                dropdownMenu &&
                !dropdownMenu.contains(e.target) &&
                !e.target.closest(".dropdown-toggle")
            ) {
                closeAllDropdowns();
            }
        } else if (!e.target.closest(".dropdown")) {
            closeAllDropdowns();
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeAllDropdowns();
        }
    });

    // ===========================
    // ANIMATION DE PARTICULES (canvas)
    // ===========================
    (function initParticlesModule() {
        var canvas = document.getElementById("particles-canvas");
        if (!canvas) return; // nothing to do if canvas absent

        var ctx = canvas.getContext("2d");
        var dpr = Math.max(window.devicePixelRatio || 1, 1);

        // controls
        var countRange = document.getElementById("count-range");
        var countValue = document.getElementById("count-value");
        var sizeRange = document.getElementById("size-range");
        var sizeValue = document.getElementById("size-value");
        var colorInput = document.getElementById("color-input");
        // Convertit un hex (#rrggbb ou #rgb) en {r,g,b} ou null si invalide
        function hexToRgb(hex) {
            if (!hex) return null;
            var h = hex.replace("#", "").trim();
            if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
            if (h.length !== 6) return null;
            var r = parseInt(h.substr(0, 2), 16);
            var g = parseInt(h.substr(2, 2), 16);
            var b = parseInt(h.substr(4, 2), 16);
            if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
            return { r: r, g: g, b: b };
        }
        var connectToggle = document.getElementById("connect-toggle");
        var btnPlay = document.getElementById("btn-play");
        var btnClear = document.getElementById("btn-clear");
        var fpsDisplay = document.getElementById("fps-display");
        var particlesCountDisplay = document.getElementById("particles-count");

        var CONNECT_DISTANCE = 135;
        var CONNECT_DISTANCE_SQ = CONNECT_DISTANCE * CONNECT_DISTANCE;

        var particles = [];
        var running = true;
        var lastTime = performance.now();
        var fps = 0;

        function rand(min, max) {
            return Math.random() * (max - min) + min;
        }

        function Particle(x, y, vx, vy, r, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.r = r;
            this.color = color;
        }
        Particle.prototype.update = function (dt, width, height) {
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            if (this.x - this.r < 0) {
                this.x = this.r;
                this.vx *= -1;
            } else if (this.x + this.r > width) {
                this.x = width - this.r;
                this.vx *= -1;
            }
            if (this.y - this.r < 0) {
                this.y = this.r;
                this.vy *= -1;
            } else if (this.y + this.r > height) {
                this.y = height - this.r;
                this.vy *= -1;
            }
        };
        Particle.prototype.draw = function (ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
        };

        function resizeCanvas() {
            var rect = canvas.getBoundingClientRect();
            dpr = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function fitCanvasToParent() {
            var parent = canvas.parentElement;
            if (!parent) return;
            var height = Math.min(window.innerHeight * 0.6, 640);
            canvas.style.width = parent.clientWidth + "px";
            canvas.style.height = height + "px";
            resizeCanvas();
        }

        function initParticles(count) {
            particles = [];
            var rect = canvas.getBoundingClientRect();
            var w = rect.width,
                h = rect.height;
            var baseR = sizeRange ? Number(sizeRange.value) : 3;
            var col = colorInput ? colorInput.value : "#f7df1e";
            for (var i = 0; i < count; i++) {
                var r = Math.max(1, baseR * rand(0.8, 1.2));
                var x = rand(r, w - r);
                var y = rand(r, h - r);
                var speed = rand(20, 80);
                var angle = rand(0, Math.PI * 2);
                var vx = Math.cos(angle) * speed;
                var vy = Math.sin(angle) * speed;
                particles.push(new Particle(x, y, vx, vy, r, col));
            }
            updateParticlesCount();
        }
        
        function updateParticlesCount() {
            if (particlesCountDisplay)
                particlesCountDisplay.textContent = "Particules: " + particles.length;
        }

        function step(now) {
            var dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            var instantFps = 1 / Math.max(dt, 1e-6);
            fps = fps ? fps * 0.9 + instantFps * 0.1 : instantFps;
            if (fpsDisplay) fpsDisplay.textContent = "FPS: " + Math.round(fps);
            if (!running) {
                requestAnimationFrame(step);
                return;
            }

            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            var rect = canvas.getBoundingClientRect();
            var width = rect.width,
                height = rect.height;

            for (var i = 0; i < particles.length; i++)
                particles[i].update(dt, width, height);

            if (connectToggle && connectToggle.checked) {
                ctx.save();
                for (var i = 0; i < particles.length; i++) {
                    var a = particles[i];
                    for (var j = i + 1; j < particles.length; j++) {
                        var b = particles[j];
                        var dx = a.x - b.x,
                            dy = a.y - b.y;
                        var distSq = dx * dx + dy * dy;
                        if (distSq <= CONNECT_DISTANCE_SQ) {
                            var alpha = 1 - Math.sqrt(distSq) / CONNECT_DISTANCE;
                            // récupérer la couleur choisie et convertir en RGB
                            var baseHex = colorInput && colorInput.value ? colorInput.value : "#f7df1e";
                            var rgb = hexToRgb(baseHex) || { r: 247, g: 223, b: 30 };
                            ctx.strokeStyle = "rgba(" +
                                Math.round(rgb.r) + "," +
                                Math.round(rgb.g) + "," +
                                Math.round(rgb.b) + "," +
                                (alpha * 0.9) +
                                ")";
                            ctx.lineWidth = 0.4;
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }
                    }
                }
                ctx.restore();
            }

            for (var k = 0; k < particles.length; k++) particles[k].draw(ctx);
            requestAnimationFrame(step);
        }

        function bindControls() {
            if (countRange && countValue) {
                countValue.textContent = countRange.value;
                countRange.addEventListener("input", function () {
                    countValue.textContent = countRange.value;
                });
                countRange.addEventListener("change", function () {
                    initParticles(Number(countRange.value));
                });
            }
            if (sizeRange && sizeValue) {
                sizeValue.textContent = sizeRange.value;
                sizeRange.addEventListener("input", function () {
                    sizeValue.textContent = sizeRange.value;
                });
                sizeRange.addEventListener("change", function () {
                    var newSize = Number(sizeRange.value);
                    for (var i = 0; i < particles.length; i++)
                        particles[i].r = Math.max(1, newSize * 0.95);
                });
            }
            if (colorInput)
                colorInput.addEventListener("change", function () {
                    for (var i = 0; i < particles.length; i++)
                        particles[i].color = colorInput.value;
                });
            if (btnPlay)
                btnPlay.addEventListener("click", function () {
                    running = !running;
                    btnPlay.textContent = running ? "Pause" : "Play";
                    btnPlay.setAttribute("aria-pressed", String(!running));
                });
            if (btnClear)
                btnClear.addEventListener("click", function () {
                    initParticles(Number(countRange ? countRange.value : 120));
                });
        }

        var resizeTimer = null;
        function onResize() {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                fitCanvasToParent();
                initParticles(
                    particles.length || Number(countRange ? countRange.value : 120)
                );
            }, 160);
        }

        // start
        fitCanvasToParent();
        initParticles(Number(countRange ? countRange.value : 120));
        bindControls();
        lastTime = performance.now();
        requestAnimationFrame(step);
        window.addEventListener("resize", onResize);
    })();
});
