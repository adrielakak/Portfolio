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

// 4. Minecraft Easter Egg (Mining CV)
document.addEventListener("DOMContentLoaded", () => {
    const mcBlock = document.getElementById("mc-block");
    const cvBtn = document.getElementById("mc-cv-btn");
    let clicks = 0;
    
    if (mcBlock && cvBtn) {
        mcBlock.addEventListener("click", () => {
            clicks++;
            
            // Add shake class
            mcBlock.classList.remove("mining");
            void mcBlock.offsetWidth; // trigger reflow
            mcBlock.classList.add("mining");

            // Cracks
            if (clicks === 1) mcBlock.classList.add("cracked-1");
            if (clicks === 2) {
                mcBlock.classList.remove("cracked-1");
                mcBlock.classList.add("cracked-2");
            }
            if (clicks === 3) {
                mcBlock.classList.remove("cracked-2");
                mcBlock.classList.add("cracked-3");
            }
            
            if (clicks >= 4) {
                // Break block!
                mcBlock.style.opacity = 0;
                setTimeout(() => {
                    mcBlock.classList.add("broken");
                    cvBtn.classList.remove("hidden-cv");
                    cvBtn.classList.add("revealed-cv");
                }, 50);
                
                // Add particle effects
                createParticles(mcBlock);
            }
        });
    }

    function createParticles(block) {
        const rect = block.getBoundingClientRect();
        const container = document.body;
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = (4 + Math.random() * 6) + 'px';
            particle.style.height = particle.style.width;
            // Mixed colors: stone and accent
            particle.style.backgroundColor = Math.random() > 0.6 ? 'var(--accent)' : '#555'; 
            particle.style.left = (rect.left + rect.width / 2) + window.scrollX + 'px';
            particle.style.top = (rect.top + rect.height / 2) + window.scrollY + 'px';
            particle.style.zIndex = 1000;
            particle.style.borderRadius = '2px';
            container.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = 30 + Math.random() * 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 40; // upward bias

            gsap.to(particle, {
                x: tx,
                y: ty,
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 0.6 + Math.random() * 0.4,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        }
    }
});
