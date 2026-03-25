import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Scroll Animations - Fade & Slide Up
document.addEventListener("DOMContentLoaded", () => {
    // Reveal sections
    const sections = document.querySelectorAll("section");
    sections.forEach(sec => {
        gsap.fromTo(sec, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: "power2.out", 
                scrollTrigger: {
                    trigger: sec,
                    start: "top 80%",
                    once: true
                }
            }
        );
    });

    // Reveal project cards with stagger
    const projectCards = document.querySelectorAll(".project-card");
    if(projectCards.length > 0) {
        gsap.fromTo(projectCards, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                ease: "power2.out", 
                stagger: 0.15,
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 85%",
                    once: true
                }
            }
        );
    }

    // Reveal skills
    const skills = document.querySelectorAll(".skills-list li");
    if(skills.length > 0) {
        gsap.fromTo(skills, 
            { opacity: 0, x: -20 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.5, 
                ease: "power2.out", 
                stagger: 0.05,
                scrollTrigger: {
                    trigger: ".skills-grid",
                    start: "top 85%",
                    once: true
                }
            }
        );
    }

    // Reveal entries (education / experience)
    const entries = document.querySelectorAll(".entry");
    entries.forEach(entry => {
        gsap.fromTo(entry,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: entry,
                    start: "top 85%",
                    once: true
                }
            }
        );
    });
});

// 2. Typing Animation for the Main Title
class TextType {
    constructor(el, options = {}) {
        this.el = el;
        // Text configuration
        this.texts = options.texts || [this.el.innerText];
        
        this.typingSpeed = options.typingSpeed || 75;
        this.deletingSpeed = options.deletingSpeed || 50;
        this.pauseDuration = options.pauseDuration || 1500;
        this.loop = options.loop !== undefined ? options.loop : true;
        this.showCursor = options.showCursor !== undefined ? options.showCursor : true;
        this.cursorBlinkDuration = options.cursorBlinkDuration || 0.5;
        this.cursorCharacter = options.cursorCharacter || "_";

        // State
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.displayedText = "";
        this.timeoutId = null;

        // Structure setup
        this.el.innerHTML = "";
        
        this.contentSpan = document.createElement("span");
        this.contentSpan.className = "text-type__content";
        this.el.appendChild(this.contentSpan);

        if (this.showCursor) {
            this.cursorSpan = document.createElement("span");
            this.cursorSpan.className = "text-type__cursor";
            this.cursorSpan.innerHTML = this.cursorCharacter;
            this.el.appendChild(this.cursorSpan);

            // Blinking cursor with GSAP
            gsap.to(this.cursorSpan, {
                opacity: 0,
                duration: this.cursorBlinkDuration,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        }

        // Add CSS necessary for layout
        this.el.style.display = "inline-block";
        this.el.style.whiteSpace = "pre-wrap";

        // Start animation
        this.timeoutId = setTimeout(() => this.tick(), options.initialDelay || 500);
    }

    tick() {
        const fullText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.displayedText = fullText.substring(0, this.displayedText.length - 1);
            this.currentCharIndex--;
        } else {
            this.displayedText = fullText.substring(0, this.displayedText.length + 1);
            this.currentCharIndex++;
        }

        this.contentSpan.innerHTML = this.displayedText;

        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.displayedText === fullText) {
            // Finished typing the current word
            if (!this.loop && this.currentTextIndex === this.texts.length - 1) {
                return; // Stop entirely if not looping and at the end
            }
            typeSpeed = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.displayedText === "") {
            // Finished deleting
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500; // Small delay before typing the next word
        }

        this.timeoutId = setTimeout(() => this.tick(), typeSpeed);
    }

    reset(newTexts) {
        clearTimeout(this.timeoutId);
        this.texts = newTexts;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.displayedText = "";
        this.contentSpan.innerHTML = "";
        this.tick();
    }
}

// Initialize Typing Animation once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".hero h1");
    if(title) {
        const frTexts = ["Adriel Kourlate", "Data Analyst", "Développeur"];
        const enTexts = ["Adriel Kourlate", "Data Analyst", "Developer"];

        const currentLang = document.documentElement.lang || 'fr';

        // The TextType instance 
        let typer = new TextType(title, {
            texts: currentLang === 'fr' ? frTexts : enTexts,
            typingSpeed: 75,
            deletingSpeed: 50,
            pauseDuration: 2500,
            cursorCharacter: "_",
            loop: true // Enable infinite loop
        });

        // Listen to language toggle
        const toggleBtn = document.getElementById('lang-toggle');
        if(toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                setTimeout(() => {
                    const newLang = document.documentElement.lang || 'fr';
                    typer.reset(newLang === 'fr' ? frTexts : enTexts);
                }, 10);
            });
        }
    }
});

// 3. Header Auto-Hide on Scroll
document.addEventListener("DOMContentLoaded", () => {
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');
    
    if (header) {
        // Ensure the header transitions smoothly
        header.style.transition = "background-color 0.3s ease, border-color 0.3s ease, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Only hide when scrolling down past 100px, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateX(-50%) translateY(-150%)'; // Hide up
            } else {
                header.style.transform = 'translateX(-50%) translateY(0)'; // Show
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }
});

// 4. Easter Egg 1 — Diamond CV Button (Mining effect on click)
document.addEventListener("DOMContentLoaded", () => {
    const cvBtn = document.getElementById("mc-cv-btn");
    if (!cvBtn) return;

    cvBtn.addEventListener("click", (e) => {
        // Shake effect
        cvBtn.classList.remove("mining-effect");
        void cvBtn.offsetWidth;
        cvBtn.classList.add("mining-effect");

        // Spawn diamond particles from the button
        const rect = cvBtn.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = (3 + Math.random() * 5) + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = Math.random() > 0.5 ? '#37cdeb' : '#5ce1f5';
            particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            particle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            particle.style.zIndex = 1000;
            particle.style.borderRadius = '2px';
            particle.style.pointerEvents = 'none';
            document.body.appendChild(particle);

            gsap.to(particle, {
                x: (Math.random() - 0.5) * 80,
                y: -(20 + Math.random() * 60),
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 0.6 + Math.random() * 0.4,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        }
    });
});

// 5. Easter Egg 2 — Crafting Table
document.addEventListener("DOMContentLoaded", () => {
    const craftCard = document.getElementById("craft-card");
    const modal = document.getElementById("craft-modal");
    const closeBtn = document.getElementById("craft-close");
    const craftResult = document.getElementById("craft-result");

    if (!craftCard || !modal) return;

    const correctOrder = ["data", "algo", "coffee"]; // top-center, middle-center, bottom-center (slots 1, 4, 7)
    const correctSlots = [1, 4, 7];
    const icons = { data: "📊", algo: "🧠", coffee: "☕" };
    let currentIngredient = null;
    let placedCount = 0;
    let placedIngredients = {};

    // Open modal
    craftCard.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("open");
    });

    // Close modal
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
    });

    // Click ingredient to select it
    const items = modal.querySelectorAll(".craft-item");
    items.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("used")) return;
            // Deselect previously selected
            items.forEach(i => i.style.outline = 'none');
            item.style.outline = '2px solid #d4a05a';
            currentIngredient = item.dataset.ingredient;
        });
    });

    // Click slot to place ingredient
    const slots = modal.querySelectorAll(".craft-slot");
    slots.forEach(slot => {
        slot.addEventListener("click", () => {
            if (!currentIngredient || slot.classList.contains("filled")) return;

            const slotIndex = parseInt(slot.dataset.slot);
            slot.textContent = icons[currentIngredient];
            slot.classList.add("filled");

            placedIngredients[slotIndex] = currentIngredient;
            placedCount++;

            // Mark ingredient as used
            const usedItem = modal.querySelector(`.craft-item[data-ingredient="${currentIngredient}"]`);
            usedItem.classList.add("used");
            usedItem.style.outline = 'none';
            currentIngredient = null;

            // Check if all 3 placed
            if (placedCount === 3) {
                checkRecipe();
            }
        });
    });

    function checkRecipe() {
        const isCorrect = correctSlots.every((slotIdx, i) => {
            return placedIngredients[slotIdx] === correctOrder[i];
        });

        setTimeout(() => {
            if (isCorrect) {
                craftResult.innerHTML = "🎮";
                craftResult.classList.add("success");

                // After a short delay, reveal the secret project
                setTimeout(() => {
                    modal.classList.remove("open");
                    revealSecretProject();
                }, 1500);
            } else {
                craftResult.innerHTML = "❌";
                // Reset after a moment
                setTimeout(resetCraft, 1200);
            }
        }, 400);
    }

    function resetCraft() {
        placedCount = 0;
        placedIngredients = {};
        currentIngredient = null;
        craftResult.innerHTML = "<span>?</span>";
        craftResult.classList.remove("success");
        slots.forEach(s => { s.textContent = ""; s.classList.remove("filled"); });
        items.forEach(i => { i.classList.remove("used"); i.style.outline = 'none'; });
    }

    function revealSecretProject() {
        const lang = document.documentElement.lang || 'fr';
        craftCard.style.borderStyle = 'solid';
        craftCard.style.borderColor = 'rgba(122, 182, 72, 0.6)';
        craftCard.style.boxShadow = '0 0 25px rgba(122, 182, 72, 0.15)';
        craftCard.innerHTML = `
            <h3>🎮 Projet-Dame-</h3>
            <div class="subtitle">Python · Easter Egg</div>
            <p>${lang === 'fr'
                ? 'Bravo ! Vous avez crafté un secret ! Ce jeu de dames a été codé en Python avec logique de grille mathématique. Un clin d\'oeil à ma passion pour Minecraft et le gaming !'
                : 'Congrats! You crafted a secret! This checkers game was coded in Python with mathematical grid logic. A nod to my passion for Minecraft and gaming!'
            }</p>
            <a href="https://github.com/adrielakak/Projet-Dame-" target="_blank" style="color: var(--accent); text-decoration: underline; font-size: 0.9rem; margin-top: 0.5rem; display: inline-block;">${lang === 'fr' ? 'Voir sur GitHub →' : 'View on GitHub →'}</a>
        `;
        gsap.fromTo(craftCard, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
    }
});

// 6. Easter Egg 3 — Nether Portal (Obsidian Block)
document.addEventListener("DOMContentLoaded", () => {
    const obsidian = document.getElementById("obsidian-block");
    if (!obsidian) return;

    let clicks = 0;
    const REQUIRED_CLICKS = 5;
    let netherActive = false;
    let particleInterval = null;

    obsidian.addEventListener("click", () => {
        clicks++;

        // Pulse animation
        obsidian.classList.remove("activating");
        void obsidian.offsetWidth;
        obsidian.classList.add("activating");

        // Visual feedback: glow increases
        const progress = clicks / REQUIRED_CLICKS;
        obsidian.style.boxShadow = `0 0 ${10 + progress * 30}px rgba(128, 0, 255, ${0.2 + progress * 0.5}), inset -2px -2px 0 rgba(0,0,0,0.6), inset 2px 2px 0 rgba(80, 30, 120, 0.3)`;

        if (clicks >= REQUIRED_CLICKS && !netherActive) {
            activateNether();
        } else if (clicks >= REQUIRED_CLICKS * 2 && netherActive) {
            deactivateNether();
            clicks = 0;
        }
    });

    function activateNether() {
        netherActive = true;
        document.body.classList.add("nether-mode");

        // Update hint text
        const hint = document.querySelector(".obsidian-hint");
        if (hint) {
            const lang = document.documentElement.lang || 'fr';
            hint.textContent = lang === 'fr' ? 'Portail activé ! Cliquez encore pour revenir...' : 'Portal activated! Click again to go back...';
            hint.style.opacity = '1';
            hint.style.color = '#8b00ff';
        }

        // Update background shader color to purple
        // The background.js exposes uniforms on the global scope via the canvas
        // We'll dispatch a custom event
        window.dispatchEvent(new CustomEvent('nether-mode', { detail: { active: true } }));

        // Spawn floating particles
        particleInterval = setInterval(spawnNetherParticle, 200);

        // Flash effect
        gsap.fromTo(document.body, { opacity: 0.5 }, { opacity: 1, duration: 0.5 });
    }

    function deactivateNether() {
        netherActive = false;
        document.body.classList.remove("nether-mode");

        const hint = document.querySelector(".obsidian-hint");
        if (hint) {
            const lang = document.documentElement.lang || 'fr';
            hint.textContent = lang === 'fr' ? 'Un bloc mystérieux...' : 'A mysterious block...';
            hint.style.opacity = '0.5';
            hint.style.color = 'var(--text-secondary)';
        }

        window.dispatchEvent(new CustomEvent('nether-mode', { detail: { active: false } }));
        if (particleInterval) clearInterval(particleInterval);

        // Remove existing particles
        document.querySelectorAll('.nether-particle').forEach(p => p.remove());
    }

    function spawnNetherParticle() {
        const particle = document.createElement('div');
        particle.className = 'nether-particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        document.body.appendChild(particle);

        gsap.to(particle, {
            y: -(window.innerHeight + 50),
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 3 + Math.random() * 3,
            ease: "none",
            onComplete: () => particle.remove()
        });
    }
});

