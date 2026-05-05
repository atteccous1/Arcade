document.addEventListener('DOMContentLoaded', () => {
    // Cursor Follower Logic (Standard Sitewide)
    const cursorFollower = document.querySelector('.cursor-follower');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Fluid lerp movement
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursorFollower.style.left = `${cursorX}px`;
        cursorFollower.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect for interactive elements
    const updateInteractables = () => {
        const interactables = document.querySelectorAll('button, a, .f-card, .p-card, .step-card, .team-card, .h-link-card, .nav-links a, .signup-btn');
        
        interactables.forEach(item => {
            item.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
            item.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
        });
    };
    updateInteractables();

    // Background Blobs Logic
    const blobs = document.querySelectorAll('.blob');
    const blobPaths = [
        "M920,300 Q880,150 700,100 Q500,50 300,100 Q100,150 80,300 Q100,450 300,500 Q500,550 700,500 Q880,450 920,300 Z",
        "M900,350 Q850,200 650,150 Q450,100 250,150 Q50,200 60,350 Q50,500 250,550 Q450,600 650,550 Q850,500 900,350 Z",
        "M880,300 Q840,160 680,120 Q520,80 320,120 Q120,160 100,300 Q120,440 320,480 Q520,520 680,480 Q840,440 880,300 Z",
        "M900,320 Q860,180 690,130 Q510,70 310,130 Q110,180 90,320 Q110,460 310,510 Q510,560 690,510 Q860,460 900,320 Z"
    ];

    let pathIndex = 0;
    function morphBlobs() {
        pathIndex = (pathIndex + 1) % blobPaths.length;
        
        blobs.forEach((blob, i) => {
            const path = blob.querySelector('path');
            const target = (pathIndex + i) % blobPaths.length;
            path.setAttribute('d', blobPaths[target]);
        });
    }

    if (blobs.length > 0) {
        setInterval(morphBlobs, 3000);
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            blobs.forEach((blob, index) => {
                const speed = (index + 1) * 0.1;
                const yPos = scrolled * speed;
                blob.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/[^0-9.]/g, '');
                
                const inc = target / speed;

                if (count < target) {
                    const nextVal = count + inc;
                    if (target % 1 !== 0) {
                        counter.innerText = nextVal.toFixed(1) + (target === 4.9 ? '/5' : '+');
                    } else {
                        counter.innerText = Math.ceil(nextVal) + (target >= 1000 ? 'k+' : '+');
                        if (target >= 10000) counter.innerText = (Math.ceil(nextVal)/1000).toFixed(0) + 'k+';
                    }
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target >= 1000 ? (target/1000) + 'k+' : target + (target === 4.9 ? '/5' : '+');
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                if (entry.target.classList.contains('stats-bar')) {
                    startCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .about-hero, .stats-bar').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for floating cards
    document.addEventListener('mousemove', (e) => {
        const amount = 30;
        const x = (e.clientX - window.innerWidth / 2) / amount;
        const y = (e.clientY - window.innerHeight / 2) / amount;

        document.querySelectorAll('.float-anim').forEach((card, index) => {
            const depth = (index + 1) * 0.4;
            card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
    });
});