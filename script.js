const carousel = document.getElementById('carousel');
const items = carousel.querySelectorAll('.carousel-item');
const totalItems = items.length;
const angleStep = 360 / totalItems;
let targetRotation = 0;
let currentRotation = 0;
let isDragging = false;
let startX;
let startRotation;
const radius = 600;

function initCarousel() {
  items.forEach((item, index) => {
    const angle = index * angleStep;
    item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
  animate();
}

function updateCarousel() {
  carousel.style.transform = `translateZ(-${radius}px) rotateY(${currentRotation}deg)`;
  
  items.forEach((item, index) => {
    const itemAngle = (index * angleStep + currentRotation) % 360;
    const normalizedAngle = ((itemAngle % 360) + 360) % 360;
    
    // Hide items that are in the back half of the cylinder
    if (normalizedAngle >= 100 && normalizedAngle <= 260) {
      item.style.opacity = "0";
      item.style.visibility = "hidden";
    } else {
      item.style.opacity = "1";
      item.style.visibility = "visible";
    }
  });
}

function animate() {
  if (!isDragging) {
    currentRotation += (targetRotation - currentRotation) * 0.05;
  }
  updateCarousel();
  requestAnimationFrame(animate);
}

function startAutoRotation() {
  setInterval(() => {
    if (!isDragging) {
      targetRotation -= 180;
    }
  }, 4000);
}

window.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX;
  startRotation = targetRotation;
  carousel.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = e.pageX - startX;
  targetRotation = startRotation + deltaX * 0.2;
  currentRotation = targetRotation;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  carousel.style.cursor = 'grab';
});

// Fluid background blobs movement
const blobs = document.querySelectorAll('.blob');
const blobPaths = [
  "M920,300 Q880,150 700,100 Q500,50 300,100 Q100,150 80,300 Q100,450 300,500 Q500,550 700,500 Q880,450 920,300 Z",
  "M900,350 Q850,200 650,150 Q450,100 250,150 Q50,200 60,350 Q50,500 250,550 Q450,600 650,550 Q850,500 900,350 Z",
  "M880,300 Q840,160 680,120 Q520,80 320,120 Q120,160 100,300 Q120,440 320,480 Q520,520 680,480 Q840,440 880,300 Z",
  "M900,320 Q860,180 690,130 Q510,70 310,130 Q110,180 90,320 Q110,460 310,510 Q510,560 690,510 Q860,460 900,320 Z"
];

let pathIndex = 0;
function morphBlobs() {
  // Move to next path in a perfect index-based loop
  pathIndex++;
  if (pathIndex >= blobPaths.length) {
    pathIndex = 0;
  }
  
  blobs.forEach((blob, i) => {
    const path = blob.querySelector('path');
    // Offset target calculations for each blob to create variety
    const target = (pathIndex + i) % blobPaths.length;
    path.setAttribute('d', blobPaths[target]);
  });
}

// Start with a small delay to ensure initial setup
setTimeout(() => {
  setInterval(morphBlobs, 3000);
}, 100);

// Interactive Card Tilt Effect
const carouselItems = document.querySelectorAll('.carousel-item');

carouselItems.forEach(item => {
  const inner = item.querySelector('.carousel-item-inner');
  
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
  
  item.addEventListener('mouseleave', () => {
    inner.style.transform = `rotateX(0) rotateY(0) scale(1)`;
  });
});

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  blobs.forEach((blob, index) => {
    const speed = (index + 1) * 0.1;
    const yPos = scrolled * speed;
    blob.style.transform = `translateY(${yPos}px)`;
  });
});

// Cursor Follower Fluid Logic
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

// Magnetic Button & Internal Spotlight Logic
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update internal gradient spotlight
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    btn.style.setProperty('--x', `${xPercent}%`);
    btn.style.setProperty('--y', `${yPercent}%`);
    
    // Wiggle/Magnetic effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) * 0.15;
    const deltaY = (y - centerY) * 0.15;
    btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.setProperty('--x', '50%');
    btn.style.setProperty('--y', '50%');
  });
});

// Cursor Active States
document.querySelectorAll('a, .btn, .carousel-item, .course-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
  el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
});

animateCursor();

// Courses Slider Logic
const sliderContainer = document.querySelector('.courses-slider-container');
const sliderTrack = document.querySelector('.courses-track');
const sliderFill = document.querySelector('.slider-fill');

let isSliderDragging = false;
let startSliderX;
let currentSliderTranslate = 0;
let prevSliderTranslate = 0;

sliderContainer.addEventListener('mousedown', (e) => {
  isSliderDragging = true;
  startSliderX = e.pageX;
  sliderContainer.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isSliderDragging) return;
  const deltaX = e.pageX - startSliderX;
  currentSliderTranslate = prevSliderTranslate + deltaX;
  
  // Boundary constraints
  const maxTranslate = 0;
  const minTranslate = -(sliderTrack.scrollWidth - sliderContainer.clientWidth);
  
  if (currentSliderTranslate > maxTranslate) currentSliderTranslate = maxTranslate;
  if (currentSliderTranslate < minTranslate) currentSliderTranslate = minTranslate;
  
  sliderTrack.style.transform = `translateX(${currentSliderTranslate}px)`;
  
  // Update progress bar
  const progressRatio = currentSliderTranslate / minTranslate; // 0 to 1
  const maxBarTravel = 300 - 40; // slider-bar width - slider-fill width
  sliderFill.style.transform = `translateX(${progressRatio * maxBarTravel}px)`;
});

window.addEventListener('mouseup', () => {
  if (isSliderDragging) {
    isSliderDragging = false;
    prevSliderTranslate = currentSliderTranslate;
    sliderContainer.style.cursor = 'grab';
  }
});

// Arrow Navigation Logic
const btnLeft = document.querySelector('.nav-arrow.left');
const btnRight = document.querySelector('.nav-arrow.right');
const cardWidth = 400 + 24; // Updated Card width + gap

function calculateBoundaryLimits() {
    return {
        max: 0,
        min: -(sliderTrack.scrollWidth - sliderContainer.clientWidth + 40) // +40 for padding
    };
}

function updateSliderPosition(newTranslate) {
    const limits = calculateBoundaryLimits();
    currentSliderTranslate = Math.max(limits.min, Math.min(limits.max, newTranslate));
    prevSliderTranslate = currentSliderTranslate;
    
    sliderTrack.style.transform = `translateX(${currentSliderTranslate}px)`;
    
    // Update progress bar
    const progressRatio = currentSliderTranslate / limits.min; 
    const maxBarTravel = 300 - 40; 
    sliderFill.style.transform = `translateX(${progressRatio * maxBarTravel}px)`;
}

btnLeft.addEventListener('click', () => {
    updateSliderPosition(currentSliderTranslate + cardWidth);
});

btnRight.addEventListener('click', () => {
    updateSliderPosition(currentSliderTranslate - cardWidth);
});
// Course Cards Tilt Effect
document.querySelectorAll('.course-card').forEach(card => {
  const inner = card.querySelector('.course-card-inner');
  
  card.addEventListener('mousemove', (e) => {
    if (isSliderDragging) return; // Prevent tilt while dragging
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt primarily on Y axis as requested, but adding slight X for depth
    const rotateY = ((x - centerX) / centerX) * 10; // Max 10 deg
    const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg
    
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
});

// Testimonial Slider Logic
const testimonials = [
  {
    name: "Adyotya Sinha",
    role: "Technical Head Supervisor",
    quote: "Design is very personal to me, it's a story that I want to tell to the world",
    img: "assets/Adyoya1.jpeg"
  },
  {
    name: "Akhil Kushwaha",
    role: "AI Specialist",
    quote: "For me, design is something i don't plan, I execute.",
    img: "assets/Akhil.jpeg"
  },
  {
    name: "Anushka Uniyal",
    role: "UX Lead",
    quote: "Like many tools, design is a tool to solve problems.",
    img: "assets/Anushka.jpeg"
  },
  {
    name: "Sejal Goel",
    role: "Branding Expert",
    quote: "Live to learn and don't be afraid to explore.",
    img: "assets/Sejal.png"
  },
  {
    name: "Tanisha Rathor",
    role: "Creative Lead",
    quote: "Design is not just what it looks like and feels like. Design is how it works",
    img: "assets/Tanisha.jpeg"
  }
];

let currentTestimonial = 0;
const testimonialImg = document.getElementById('testimonial-img');
const testimonialQuote = document.getElementById('testimonial-quote');
const testimonialName = document.getElementById('testimonial-name');
const testimonialRole = document.getElementById('testimonial-role');
const testimonialContainer = document.querySelector('.testimonial-card-container');

function updateTestimonial(index) {
  // Remove animation class for reset
  testimonialContainer.classList.remove('animate-slide-fade');
  
  // Trigger reflow
  void testimonialContainer.offsetWidth;
  
  // Update content
  const t = testimonials[index];
  testimonialImg.src = t.img;
  testimonialQuote.innerText = t.quote;
  testimonialName.innerText = t.name;
  testimonialRole.innerText = t.role;
  
  // Re-add animation
  testimonialContainer.classList.add('animate-slide-fade');
}

document.querySelector('.testimonial-prev').addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  updateTestimonial(currentTestimonial);
});

document.querySelector('.testimonial-next').addEventListener('click', () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  updateTestimonial(currentTestimonial);
});

// Page Transition Logic
const transitionLinks = ['academics-link', 'community-link'];

transitionLinks.forEach(id => {
  const link = document.getElementById(id);
  if (link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = target;
      }, 800);
    });
  }
});

initCarousel();
startAutoRotation();
