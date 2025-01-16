// Utilidades
const animate = (element, animation, duration = 1000) => {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = `${animation} ${duration}ms ease-out forwards`;
};

// Clase para manejar el cursor personalizado
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        this.stylesCursor = `
            .custom-cursor {
                width: 20px;
                height: 20px;
                border: 2px solid var(--accent-color);
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
                transform: translate(-50%, -50%);
            }
            .custom-cursor.hover {
                transform: translate(-50%, -50%) scale(1.5);
                background-color: rgba(100, 255, 218, 0.1);
            }
        `;
        
        this.addStyles();
        this.initCursor();
    }

    addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = this.stylesCursor;
        document.head.appendChild(styleSheet);
    }

    initCursor() {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                this.cursor.style.left = `${e.clientX}px`;
                this.cursor.style.top = `${e.clientY}px`;
            });
        });
    }

    addHoverEffect(elements) {
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            element.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
    }
}

// Clase para manejar las animaciones de scroll
class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };
        
        this.observer = new IntersectionObserver(this.handleIntersection, this.observerOptions);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                this.observer.unobserve(entry.target);
            }
        });
    }

    observe(elements) {
        elements.forEach(element => this.observer.observe(element));
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar cursor personalizado
    const customCursor = new CustomCursor();
    customCursor.addHoverEffect(document.querySelectorAll('a, button, .social'));

    // Inicializar animador de scroll
    const scrollAnimator = new ScrollAnimator();
    scrollAnimator.observe(document.querySelectorAll('.about, .hero h1, .hero p'));

    // Animación de entrada para el título
    const title = document.querySelector(".hero h1");
    const subtitle = document.querySelector(".hero p");
    
    animate(title, 'fadeInDown');
    setTimeout(() => animate(subtitle, 'fadeInUp'), 500);

    // Efecto parallax en el hero
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // Animación de las redes sociales
    const socialLinks = document.querySelectorAll(".social");
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 200}ms`;
        animate(link, 'fadeInRight', 800);

        // Efecto hover avanzado
        link.addEventListener("mouseenter", () => {
            link.style.transform = 'translateY(-5px) scale(1.05)';
            link.style.background = 'linear-gradient(45deg, var(--accent-color), var(--primary-color))';
            link.style.boxShadow = '0 10px 25px rgba(100,255,218,0.3)';
        });

        link.addEventListener("mouseleave", () => {
            link.style.transform = 'translateY(0) scale(1)';
            link.style.background = 'linear-gradient(45deg, var(--primary-color), rgba(100,255,218,0.2))';
            link.style.boxShadow = '0 4px 15px rgba(100,255,218,0.1)';
        });
    });

    // Efecto de typing para textos
    const createTypingEffect = (element, text, speed = 50) => {
        let index = 0;
        element.textContent = '';
        
        const typing = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    };

    // Detectar cuando elementos entran en viewport
    const aboutSection = document.querySelector('.about');
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    aboutObserver.observe(aboutSection);

    // Añadir efecto de partículas al fondo (opcional)
    const createParticle = (x, y) => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    };

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            createParticle(e.clientX, e.clientY);
        }
    });
});

// Añadir keyframes para las animaciones
const keyframes = `
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .particle {
        position: fixed;
        pointer-events: none;
        width: 4px;
        height: 4px;
        background: var(--accent-color);
        border-radius: 50%;
        animation: particle 1s ease-out forwards;
    }

    @keyframes particle {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
`;

// Agregar los keyframes al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = keyframes;
document.head.appendChild(styleSheet);
