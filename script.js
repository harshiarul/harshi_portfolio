const spotlightPanels = document.querySelectorAll('[data-spotlight]');
const themeToggle = document.querySelector('#theme-toggle');
const themeLabel = themeToggle.querySelector('.theme-label');
const root = document.documentElement;
const savedTheme = localStorage.getItem('harshi-portfolio-theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

function setTheme(theme) {
    root.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    themeLabel.textContent = `${theme === 'light' ? 'Dark' : 'Light'} mode`;
}

setTheme(savedTheme || preferredTheme);

themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('harshi-portfolio-theme', nextTheme);
});

spotlightPanels.forEach((panel) => {
    panel.addEventListener('pointermove', (event) => {
        const bounds = panel.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        panel.style.setProperty('--spotlight-x', `${x}px`);
        panel.style.setProperty('--spotlight-y', `${y}px`);
    });
});

const revealItems = document.querySelectorAll('.section, .timeline-card, .gallery-card, .info-card');
const navLinks = [...document.querySelectorAll('.nav-links a')];

revealItems.forEach((item) => item.classList.add('reveal-on-scroll'));

if ('IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                if (link.hash === `#${entry.target.id}`) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        });
    }, { rootMargin: '-35% 0px -55% 0px' });

    document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
}