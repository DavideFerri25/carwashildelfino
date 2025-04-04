// Smooth scrolling per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animazione della navbar al scroll
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Animazione delle card al caricamento
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .price-card, .info-card').forEach(card => {
    observer.observe(card);
});

document.addEventListener('DOMContentLoaded', () => {
    const locationButtons = document.querySelectorAll('.location-btn');
    const aboutText = document.querySelector('.about-text p');
    
    const locations = {
        'cairate': `La nostra sede di Cariate ha una <strong>storia</strong> che affonda le radici negli <strong>anni '90</strong>, nata dalla passione per la cura dell'auto e cresciuta con un impegno costante verso la qualità. 
Nel corso degli anni, abbiamo evoluto le nostre tecniche e recentemente <strong>abbiamo rinnovato completamente la struttura</strong>, introducendo <strong>tecnologie moderne</strong> per offrire una pulizia ancora più profonda ed efficace. Vieni a trovarci per scoprire il piacere di un'auto sempre splendente!`,
        'olgiate olona': `Dal <strong>2018</strong> ci prendiamo cura della tua auto con <strong>passione e professionalità</strong>.<br><br>Il nostro autolavaggio è dotato delle <strong>migliori tecnologie</strong> per garantire una pulizia impeccabile, dentro e fuori. Offriamo <strong>servizi completi</strong> per donare alla tua auto <strong>freschezza e brillantezza</strong> ogni giorno. Ti aspettiamo!`
    };

    // Imposta Cairate come sede attiva di default
    locationButtons[0].classList.add('active');
    aboutText.innerHTML = locations['cairate'];

    locationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Rimuove la classe active da tutti i bottoni
            locationButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Aggiunge la classe active al bottone cliccato
            button.classList.add('active');
            
            // Aggiorna il testo in base alla sede selezionata
            const location = button.querySelector('.btn-text').textContent.toLowerCase();
            aboutText.innerHTML = locations[location];
        });
    });

    // Gestione evidenziazione sezioni nella navigazione
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    function setActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight/3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    // Gestione slider e cambio sede
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let currentSede = 'cairate';

    function updateSlider() {
        // Nascondi tutte le slide
        slides.forEach(slide => {
            slide.classList.remove('active');
            if (slide.getAttribute('data-sede') === currentSede) {
                slide.style.display = 'block';
            } else {
                slide.style.display = 'none';
            }
        });

        // Aggiorna i dots
        const activeSlides = document.querySelectorAll(`.slide[data-sede="${currentSede}"]`);
        dots.forEach((dot, index) => {
            if (index < activeSlides.length) {
                dot.style.display = 'inline-block';
            } else {
                dot.style.display = 'none';
            }
        });

        // Mostra la prima slide attiva
        const firstActiveSlide = document.querySelector(`.slide[data-sede="${currentSede}"]`);
        if (firstActiveSlide) {
            firstActiveSlide.classList.add('active');
            currentSlide = 0;
        }
    }

    function showSlide(n) {
        const activeSlides = document.querySelectorAll(`.slide[data-sede="${currentSede}"]`);
        const dots = document.querySelectorAll('.dot');
        
        activeSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        activeSlides[n].classList.add('active');
        dots[n].classList.add('active');
        currentSlide = n;
    }

    function nextSlide() {
        const activeSlides = document.querySelectorAll(`.slide[data-sede="${currentSede}"]`);
        currentSlide = (currentSlide + 1) % activeSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        const activeSlides = document.querySelectorAll(`.slide[data-sede="${currentSede}"]`);
        currentSlide = (currentSlide - 1 + activeSlides.length) % activeSlides.length;
        showSlide(currentSlide);
    }

    // Gestione cambio sede
    locationButtons.forEach(button => {
        button.addEventListener('click', () => {
            locationButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSede = button.getAttribute('data-sede');
            updateSlider();
        });
    });

    // Event listeners per i controlli dello slider
    document.querySelector('.slider-nav.next').addEventListener('click', nextSlide);
    document.querySelector('.slider-nav.prev').addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Inizializza lo slider
    updateSlider();

    // Gestione dei tab per i servizi
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Slider Pulizia Interna
    let puliziaSlideIndex = 0;
    const puliziaSlides = document.querySelectorAll('.pulizia-slide');
    const puliziaDots = document.querySelectorAll('.pulizia-slider-container .dot');

    function showPuliziaSlide(n) {
        puliziaSlideIndex = n;
        
        // Nascondi tutte le slide
        puliziaSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Rimuovi la classe active da tutti i dots
        puliziaDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostra la slide corrente
        puliziaSlides[puliziaSlideIndex].classList.add('active');
        puliziaDots[puliziaSlideIndex].classList.add('active');
    }

    function nextPuliziaSlide() {
        puliziaSlideIndex++;
        if (puliziaSlideIndex >= puliziaSlides.length) {
            puliziaSlideIndex = 0;
        }
        showPuliziaSlide(puliziaSlideIndex);
    }

    function prevPuliziaSlide() {
        puliziaSlideIndex--;
        if (puliziaSlideIndex < 0) {
            puliziaSlideIndex = puliziaSlides.length - 1;
        }
        showPuliziaSlide(puliziaSlideIndex);
    }

    // Event listeners per i pulsanti di navigazione della pulizia interna
    document.querySelector('.pulizia-slider-container .slider-nav.prev').addEventListener('click', prevPuliziaSlide);
    document.querySelector('.pulizia-slider-container .slider-nav.next').addEventListener('click', nextPuliziaSlide);

    // Gestione delle freccette per lo slider della pulizia interna
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevPuliziaSlide();
        } else if (e.key === 'ArrowRight') {
            nextPuliziaSlide();
        }
    });

    // Menu mobile
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const mobileNavItems = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Funzioni per lo slider del portale
    function showPortalSlide(n) {
        const portalSlides = document.querySelectorAll('.portal-slide');
        const portalDots = document.querySelectorAll('.portal-slider-container .dot');
        
        portalSlides.forEach(slide => slide.classList.remove('active'));
        portalDots.forEach(dot => dot.classList.remove('active'));
        
        let currentSlide = n;
        if (currentSlide >= portalSlides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = portalSlides.length - 1;
        
        portalSlides[currentSlide].classList.add('active');
        portalDots[currentSlide].classList.add('active');
    }

    function nextPortalSlide() {
        const portalSlides = document.querySelectorAll('.portal-slide');
        const currentSlide = Array.from(portalSlides).findIndex(slide => slide.classList.contains('active'));
        showPortalSlide(currentSlide + 1);
    }

    function prevPortalSlide() {
        const portalSlides = document.querySelectorAll('.portal-slide');
        const currentSlide = Array.from(portalSlides).findIndex(slide => slide.classList.contains('active'));
        showPortalSlide(currentSlide - 1);
    }

    // Inizializza lo slider del portale
    showPortalSlide(0);

    // Aggiungo event listeners per i pulsanti di navigazione del portale
    document.querySelector('.portal-slider-container .slider-nav.prev').addEventListener('click', prevPortalSlide);
    document.querySelector('.portal-slider-container .slider-nav.next').addEventListener('click', nextPortalSlide);

    // Funzioni per lo slider delle piazzole
    function showPiazzolaSlide(n) {
        const piazzolaSlides = document.querySelectorAll('.piazzola-slide');
        const piazzolaDots = document.querySelectorAll('.piazzola-slider-container .dot');
        
        piazzolaSlides.forEach(slide => slide.classList.remove('active'));
        piazzolaDots.forEach(dot => dot.classList.remove('active'));
        
        let currentSlide = n;
        if (currentSlide >= piazzolaSlides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = piazzolaSlides.length - 1;
        
        piazzolaSlides[currentSlide].classList.add('active');
        piazzolaDots[currentSlide].classList.add('active');
    }

    function nextPiazzolaSlide() {
        const piazzolaSlides = document.querySelectorAll('.piazzola-slide');
        const currentSlide = Array.from(piazzolaSlides).findIndex(slide => slide.classList.contains('active'));
        showPiazzolaSlide(currentSlide + 1);
    }

    function prevPiazzolaSlide() {
        const piazzolaSlides = document.querySelectorAll('.piazzola-slide');
        const currentSlide = Array.from(piazzolaSlides).findIndex(slide => slide.classList.contains('active'));
        showPiazzolaSlide(currentSlide - 1);
    }

    // Inizializza lo slider delle piazzole
    showPiazzolaSlide(0);

    // Aggiungo event listeners per i pulsanti di navigazione delle piazzole
    document.querySelector('.piazzola-slider-container .slider-nav.prev').addEventListener('click', prevPiazzolaSlide);
    document.querySelector('.piazzola-slider-container .slider-nav.next').addEventListener('click', nextPiazzolaSlide);

    // Aggiungo event listeners per i dots delle piazzole
    document.querySelectorAll('.piazzola-slider-container .dot').forEach((dot, index) => {
        dot.addEventListener('click', () => showPiazzolaSlide(index));
    });
});