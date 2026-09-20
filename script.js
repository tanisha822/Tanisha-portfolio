/* =================================
   NAVBAR + SCROLL OPTIMIZATION
================================= */

const navbar = document.querySelector(".navbar");
const backToTop = document.querySelector(".back-top");
const sections = document.querySelectorAll("section[id]");
const navLinkItems = document.querySelectorAll(".nav-links a");

let ticking = false;

function handleScroll() {
    const scrollY = window.scrollY;

    if (navbar) {
        navbar.classList.toggle("scrolled", scrollY > 40);
    }

    if (backToTop) {
        if (scrollY > 500) {
            backToTop.style.opacity = "1";
            backToTop.style.pointerEvents = "auto";
        } else {
            backToTop.style.opacity = "0";
            backToTop.style.pointerEvents = "none";
        }
    }

    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 180;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            currentSection = section.id;
        }
    });

    navLinkItems.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });

    ticking = false;
}

window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
    }
}, { passive: true });

/* =================================
   SCROLL REVEAL
================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
}, {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px"
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

/* =================================
   MOBILE MENU
================================= */

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        menuBtn.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuBtn.classList.remove("open");
        });
    });
}

/* =================================
   BUTTON CLICK EFFECT
================================= */

const buttons = document.querySelectorAll(
    "button, .btn, .resume-btn, .project-link"
);

const isTouchDevice = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
).matches;

if (!isTouchDevice) {
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            button.style.transform = "scale(0.96)";

            setTimeout(() => {
                button.style.transform = "";
            }, 120);
        });
    });
}

/* =================================
   CONTACT FORM
================================= */

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async event => {
        event.preventDefault();

        const submitButton = contactForm.querySelector(
            "button[type='submit']"
        );
        const status = contactForm.querySelector(".form-status");
        const originalText = submitButton
            ? submitButton.textContent
            : "";

        if (submitButton) {
            submitButton.textContent = "Sending...";
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (response.ok) {
                if (status) {
                    status.textContent = "Message sent successfully!";
                }

                contactForm.reset();
            } else {
                if (status) {
                    status.textContent =
                        "Something went wrong. Please try again.";
                }
            }
        } catch (error) {
            if (status) {
                status.textContent =
                    "Network error. Please try again.";
            }
        }

        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

/* =================================
   BACK TO TOP
================================= */

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* =================================
   CARD HOVER + MOUSE FOLLOW GLOW
================================= */

const hoverCards = document.querySelectorAll(
    ".project-feature, .project-small, .experience-card"
);

if (!isTouchDevice) {
    hoverCards.forEach(card => {
        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.removeProperty("--mouse-x");
            card.style.removeProperty("--mouse-y");
        });
    });
}

/* =================================
   TOUCH DEVICE DETECTION
================================= */

if (isTouchDevice) {
    document.body.classList.add("touch-device");
}

/* =================================
   PAGE LOADED
================================= */

window.addEventListener("load", () => {
    document.body.classList.add("page-loaded");
    handleScroll();
});