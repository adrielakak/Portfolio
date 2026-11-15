import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 0. Preloader Logic
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = ''; // Restore scroll
                ScrollTrigger.refresh();
            }
        });

        tl.to('.preloader-text', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
          .to('.preloader-line', { scaleX: 1, duration: 1.5, ease: 'expo.inOut' }, "-=0.5")
          .to('.preloader-text', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, "+=0.3")
          .to('.preloader-line', { opacity: 0, scaleX: 0, duration: 0.3, ease: 'power2.in' }, "-=0.3")
          .to('#preloader', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' })
          .from('.hero-content h1', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.6")
          .from('.hero-content .subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.8")
          .from('.hero-content p', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.7")
          .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
          .from('.pc-card-wrapper', { scale: 0.85, opacity: 0, rotationY: -15, duration: 1.5, ease: 'elastic.out(1, 0.7)' }, "-=0.8")
          .set('#preloader', { display: 'none' });
    }
});

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

// 3. Dynamic Island / GravityNotch Morphic Navbar
document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('site-header') || document.querySelector('header');
    const sectionWrap = document.getElementById('island-section-wrap');
    const indexEl = document.getElementById('island-index');
    const nameEl = document.getElementById('island-section-name');
    const percentEl = document.getElementById('island-percent');
    const progressBar = document.getElementById('island-progress-bar');
    const statusBtn = document.getElementById('island-status');

    if (!header || !indexEl || !nameEl || !percentEl || !progressBar || !statusBtn) return;

    const navLinks = Array.from(header.querySelectorAll('.nav-links a[data-section]'));
    const sections = [
        { id: 'hero', index: '00', fr: 'Intro', en: 'Intro' },
        { id: 'education', index: '01', fr: 'Parcours', en: 'Education' },
        { id: 'skills', index: '02', fr: 'Compétences', en: 'Skills' },
        { id: 'experience', index: '03', fr: 'Expériences', en: 'Experience' },
        { id: 'projects', index: '04', fr: 'Projets', en: 'Projects' },
        { id: 'contact', index: '05', fr: 'Contact', en: 'Contact' }
    ].map(item => ({ ...item, el: document.getElementById(item.id) }))
     .filter(item => item.el);

    if (sections.length === 0) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lastSectionId = null;
    let lastScrollY = window.scrollY;
    let rafPending = false;

    const getDocumentTop = (el) => {
        let top = 0;
        let node = el;
        while (node) {
            top += node.offsetTop;
            node = node.offsetParent;
        }
        return top;
    };

    const getActiveSection = (scrollY, maxScroll) => {
        if (maxScroll > 0 && window.innerHeight + scrollY >= document.documentElement.scrollHeight - 24) {
            return sections[sections.length - 1];
        }
        const probeY = scrollY + window.innerHeight * 0.35;
        let current = sections[0];
        for (const sec of sections) {
            if (getDocumentTop(sec.el) <= probeY) {
                current = sec;
            }
        }
        return current;
    };

    const updateIsland = (forceLabel = false) => {
        rafPending = false;
        const scrollY = window.scrollY;
        const direction = scrollY >= lastScrollY ? 1 : -1;
        lastScrollY = scrollY;

        const isCompact = scrollY > 80;
        header.classList.toggle('island-compact', isCompact);
        if (!isCompact) {
            header.classList.remove('island-open');
        } else if (window.matchMedia('(hover: hover)').matches && header.matches(':hover')) {
            header.classList.add('island-open');
        }

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
        const percent = Math.round(ratio * 100);

        progressBar.style.width = `${(ratio * 100).toFixed(1)}%`;
        percentEl.textContent = `${percent}%`;

        const active = getActiveSection(scrollY, maxScroll);
        navLinks.forEach(link => {
            link.classList.toggle('active-nav', link.dataset.section === active.id);
        });

        const sectionChanged = active.id !== lastSectionId;
        if (sectionChanged || forceLabel) {
            const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
            indexEl.textContent = active.index;
            nameEl.textContent = active[lang];
            statusBtn.setAttribute(
                'aria-label',
                lang === 'en'
                    ? `Current section: ${active.en}. Expand navigation`
                    : `Section actuelle : ${active.fr}. Ouvrir la navigation`
            );

            if (sectionChanged && lastSectionId !== null && sectionWrap && !reducedMotionQuery.matches) {
                gsap.fromTo(
                    sectionWrap,
                    { y: direction * 6, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out', overwrite: 'auto' }
                );
            }
            lastSectionId = active.id;
        }
    };

    const scheduleUpdate = () => {
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => updateIsland(false));
        }
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    header.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'touch' && header.classList.contains('island-compact')) {
            header.classList.add('island-open');
        }
    });

    header.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'touch') {
            header.classList.remove('island-open');
        }
    });

    const toggleExpand = () => {
        if (header.classList.contains('island-compact')) {
            header.classList.toggle('island-open');
        }
    };

    statusBtn.addEventListener('click', toggleExpand);
    statusBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpand();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            header.classList.remove('island-open');
            if (e.detail > 0) e.currentTarget.blur();
        });
    });

    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            header.classList.remove('island-open');
        }
    });

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            if (e.detail > 0) langToggle.blur();
            setTimeout(() => updateIsland(true), 10);
        });
    }

    updateIsland(true);
});

// 4. Easter Egg 1 removed as requested

// 5. Easter Egg 2 — Crafting Table (click items in order)
document.addEventListener("DOMContentLoaded", () => {
    // The trigger is now the profile wrapper
    const heroPhoto = document.querySelector(".pc-card-wrapper");
    if(!heroPhoto) return;
    // Redirect to the dedicated crafting page on success
    let pressTimer;
    let isPressed = false;

    const startPress = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return; // Only left click
        isPressed = true;
        // Visual feedback during hold
        heroPhoto.style.transition = "transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)";
        heroPhoto.style.transform = "scale(0.85)";
        
        pressTimer = setTimeout(() => {
            if (isPressed) {
                window.location.href = "craft.html";
                cancelPress();
            }
        }, 3000);
    };

    const cancelPress = () => {
        isPressed = false;
        clearTimeout(pressTimer);
        heroPhoto.style.transition = "transform 0.4s ease";
        heroPhoto.style.transform = "scale(1)";
    };

    // Prevent context menu to avoid interrupting the hold on mobile
    heroPhoto.addEventListener("contextmenu", (e) => e.preventDefault());

    // Mouse events
    heroPhoto.addEventListener("mousedown", startPress);
    heroPhoto.addEventListener("mouseup", cancelPress);
    heroPhoto.addEventListener("mouseleave", cancelPress);

    // Touch events for mobile
    heroPhoto.addEventListener("touchstart", (e) => {
        startPress(e);
    }, {passive: true});
    heroPhoto.addEventListener("touchend", cancelPress);
    heroPhoto.addEventListener("touchcancel", cancelPress);
});

// 6. Easter Egg 3 — Nether Portal (One click to activate permanently)
document.addEventListener("DOMContentLoaded", () => {
    const obsidian = document.getElementById("obsidian-block");
    if (!obsidian) return;

    let activated = false;

    obsidian.addEventListener("click", () => {
        if (activated) return;
        activated = true;

        document.body.classList.add("nether-mode");

        // Change background shader to purple
        window.dispatchEvent(new CustomEvent('nether-mode', { detail: { active: true } }));

        // Flash effect
        gsap.fromTo(document.body, { opacity: 0.5 }, { opacity: 1, duration: 0.5 });

        // Make the obsidian glow permanently
        obsidian.style.boxShadow = '0 0 30px rgba(128, 0, 255, 0.6), inset -2px -2px 0 rgba(0,0,0,0.6), inset 2px 2px 0 rgba(80, 30, 120, 0.5)';
        obsidian.style.borderColor = '#8b00ff';

        // Spawn floating nether particles continuously
        setInterval(() => {
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
        }, 200);
    });
});

// 7. Project Dialogs Management
document.addEventListener("DOMContentLoaded", () => {
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    const dialogs = document.querySelectorAll(".project-dialog");
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const modalId = trigger.getAttribute("data-modal");
            const dialog = document.getElementById(modalId);
            if (dialog) {
                dialog.showModal();
                document.body.style.overflow = "hidden"; // Prevent scrolling behind
                dialog.classList.add("open");
            }
        });
    });

    dialogs.forEach(dialog => {
        const closeBtn = dialog.querySelector(".dialog-close");
        
        const closeModal = () => {
            dialog.classList.remove("open");
            // Wait for slide/fade animations to complete before closing natively
            setTimeout(() => {
                dialog.close();
                // Check if any other dialogs are open before restoring overflow
                const anyOpen = Array.from(dialogs).some(d => d.open);
                if (!anyOpen) {
                    document.body.style.overflow = "";
                }
            }, 300); // matches CSS animation duration
        };

        if (closeBtn) {
            closeBtn.addEventListener("click", closeModal);
        }

        // Catch Escape key and intercept for animation
        dialog.addEventListener("cancel", (e) => {
            e.preventDefault();
            closeModal();
        });

        // Fallback for browsers without native closedby="any" support (clicking outside the dialog)
        if (!('closedBy' in HTMLDialogElement.prototype)) {
            dialog.addEventListener("click", (event) => {
                if (event.target !== dialog) return;
                const rect = dialog.getBoundingClientRect();
                const isDialogContent = (
                    rect.top <= event.clientY &&
                    event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX &&
                    event.clientX <= rect.left + rect.width
                );
                if (!isDialogContent) {
                    closeModal();
                }
            });
        } else {
            // Modern support: the browser triggers close natively on backdrop click.
            // Let's capture the native close event to restore overflow.
            dialog.addEventListener("close", () => {
                const anyOpen = Array.from(dialogs).some(d => d.open);
                if (!anyOpen) {
                    document.body.style.overflow = "";
                }
            });
        }
    });
});


