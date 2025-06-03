document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const body = document.querySelector('body');
    const links = document.querySelectorAll('.nav-link');
    const themeBtn = document.querySelector('#theme-toggle-btn');
    const whiteOverlay = document.querySelector('.white-transition-overlay');
    const spotlight = document.querySelector('.spotlight-overlay');
    const tooltip = document.querySelector('.spotlight-tooltip');

    // Variables for spotlight cursor effect
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const speed = 0.08; // Spotlight follow speed

    // ---------------------------
    // THEME TOGGLE FUNCTIONALITY
    // ---------------------------

    themeBtn.addEventListener('click', toggleTheme);

    // Get saved vars from localStorage
    const savedTheme = localStorage.getItem('theme'); // Apply saved theme from localStorage. Default: dark

    if(savedTheme === 'light') {
        body.classList.add('light');
        turnDay();
    } else {
        body.classList.remove('light');
        turnNight();
    }

    // Theme toggle function declaration
    function toggleTheme() {
        body.classList.toggle('light');
        if(body.classList.contains('light')) {
            turnDay()
        } else {
            turnNight();
        }
    }

    // Change theme button to moon, save theme preference, turn day
    function turnDay() {
        themeBtn.children[0].classList.remove('fa-sun');
        themeBtn.children[0].classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
        localStorage.setItem('spotlightOn', 'false');
        spotlight.classList.add('day');
    }

    // Change theme button to sun, save theme preference, turn night
    async function turnNight() {
        spotlight.classList.remove('day');
        themeBtn.children[0].classList.add('fa-sun');
        themeBtn.children[0].classList.remove('fa-moon');
        localStorage.setItem('theme', 'dark');

        if(localStorage.getItem('spotlightOn') !== 'true') {
            spotlight.classList.add('night');
            let flickers = Math.floor(Math.random() * 3 + 4) // Min flickers: 4, max: 9
            let flicker;

            await new Promise(resolve => setTimeout(resolve, 1100)); // Wait a short moment before the light flickers

            for(let i = 0; i < flickers; i++) {
                flicker = biasedRandom(50, 300, 100, 0.5);
                if(spotlight.classList.contains('night')) spotlight.classList.remove('night');
                else spotlight.classList.add('night');

                await new Promise(resolve => setTimeout(resolve, flicker)); // Wait for the current flicker to finish before starting the next one
            }
            spotlight.classList.remove('night'); // Ensure the light ends up being visible.
            localStorage.setItem('spotlightOn', 'true');
        }
    }

    // ---------------------------
    // NAVIGATION LINK HIGHLIGHT
    // ---------------------------

    // Get the current page name from URL
    const path = window.location.pathname;
    const currentPage = path.split('/').pop();

    // Apply a red/orange underline on the current page
    // "portfolio" comparison is for when the page is first loaded (on github)
    links.forEach(link => {
        if(link.dataset.page === currentPage || link.dataset.page === "portfolio") {
            link.classList.add('active');
        }
    });

    // --------------------------
    // SPOTLIGHT TOOLTIP
    // --------------------------

    const visited = localStorage.getItem('visited');
    if(visited !== 'true' && savedTheme === 'dark'){
        // Wait 3 seconds, then fade out
        setTimeout(() => {
            tooltipOut();
        }, 3000);

        // Remove the tooltip after it fades out out to clean up
        setTimeout(() => {
            tooltip.parentNode.removeChild(tooltip);
        }, 30000);
    } else {
        tooltip.parentNode.removeChild(tooltip); // If the tooltip has been views before, remove it immediately
    }

    // Funtion to make the tooltip flicker a bit and then disappear
    async function tooltipOut() {
        let flicker; // How long the light stays out for
        for(let i = 0; i < 14; i++){ // It will always end being invisible since it looks an even number of times
            flicker = biasedRandom(50, 300, 100, 0.5);
            tooltip.style.opacity = tooltip.style.opacity == 0? 1 : 0;

            await new Promise(resolve => setTimeout(resolve, flicker)); // Wait for the current flicker to finish before starting the next one
        }

        localStorage.setItem('visited', 'true');
    }

    // Function to generate a random int biased towards a given number
    function biasedRandom(min, max, bias, influence) {
        let rnd = Math.random() * (max - min) + min;
        let mix = Math.random() * influence;
        return Math.floor(rnd * (1 - mix) + bias * mix);
    }

    // ---------------------------
    // SPOTLIGHT CURSOR EFFECT
    // ---------------------------

    // Track mouse position
    root.addEventListener('mousemove', e => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Animate spotlight position with easing (lerp)
    function animate() {
        currentX += (targetX - currentX) * speed;
        currentY += (targetY - currentY) * speed;

        root.style.setProperty('--mouse-x', `${currentX}px`);
        root.style.setProperty('--mouse-y', `${currentY}px`);

        requestAnimationFrame(animate);
    }

    animate();

    // ---------------------------
    // NAV LINK CLICK TRANSITION
    // ---------------------------

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault(); // Stop default navigation

            const href = link.getAttribute('href'); // Get link target
            whiteOverlay.classList.add('active'); // Activate the white overlay transition

            // Navigate after the animation ends
            setTimeout(() => {
                window.location.href = href;
            }, 450); // Match with transition duration in CSS
        });
    });
});
