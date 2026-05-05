document.addEventListener('DOMContentLoaded', () => {
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

    // Hover effect for cursor
    const interactables = document.querySelectorAll('button, a, .tag, .card, .course-card, .tab-btn');
    interactables.forEach(item => {
        item.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
        item.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
    });

    // Magnetic effect for the filter button
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('mousemove', (e) => {
            const rect = filterBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            filterBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        filterBtn.addEventListener('mouseleave', () => {
            filterBtn.style.transform = 'translate(0, 0)';
        });
    }

    // Parallax effect for cards
    const visual = document.querySelector('.hero-visual');
    const cards = document.querySelectorAll('.card');
    
    if (visual) {
        visual.addEventListener('mousemove', (e) => {
            const rect = visual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            cards.forEach((card, index) => {
                const depth = (index + 1) * 20;
                const moveX = x * depth;
                const moveY = y * depth;
                // Combining existing animation with parallax would be tricky, 
                // so we just apply a slight offset
                card.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        visual.addEventListener('mouseleave', () => {
            cards.forEach(card => {
                card.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Modal Logic
    const modal = document.getElementById('course-modal');
    const trigger = document.getElementById('uiux-trigger');
    const closeBtn = document.querySelector('.close-modal');

    if (trigger && modal) {
        trigger.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        };

        closeBtn.addEventListener('click', closeModal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Profile Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');

                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked button and target content
                btn.classList.add('active');
                document.getElementById(target).classList.add('active');

                // Cursor feedback
                cursorFollower.classList.add('active');
                setTimeout(() => {
                    cursorFollower.classList.remove('active');
                }, 300);
            });
        });
    }
});