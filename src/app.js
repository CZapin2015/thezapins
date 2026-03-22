/* ===== thezapins.com - Stephanie & Corey ===== */

gsap.registerPlugin(ScrollTrigger);

// Wait for fonts before showing hero
document.fonts.ready.then(() => {
  document.body.classList.add('fonts-loaded');
});

// ===== HERO ENTRANCE ANIMATION =====
// Only play the drawing animation if user loads at top of page
// Otherwise everything is visible by default (CSS has no hidden states)
if (window.scrollY < window.innerHeight * 0.3) {
  // Hide elements first, then animate them in
  gsap.set('.corner', { opacity: 0 });
  gsap.set('#sigText', { clipPath: 'inset(0 100% 0 0)' });
  gsap.set('#heroDivider', { transform: 'scaleX(0)' });
  gsap.set(['#heroDate', '#heroVenue', '#heroDress', '#heroCountdown', '#scrollHint'], { opacity: 0, y: 6 });

  const heroTL = gsap.timeline({ delay: 0.2 });

  heroTL
    .to('.corner', { opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power1.out' })
    .to('#sigText', { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power3.out' }, 0.25)
    // Details appear
    .to('#heroDivider', { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 1.85)
    .to('#heroDate', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.0)
    .to('#heroVenue', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.1)
    .to('#heroDress', { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 2.2)
    .to('#heroCountdown', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.35)
    .to('#scrollHint', { opacity: 1, duration: 0.5 }, 2.6);
}
// If scrolled past hero on load: everything is already visible via CSS defaults


// ===== HERO PARALLAX ON SCROLL =====
// Only parallax the background -- content scrolls off naturally
gsap.to('#heroBg', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  y: 100
});


// ===== SECTION REVEAL ANIMATIONS =====

// Titles and subtitles fade up
document.querySelectorAll('.reveal').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out'
  });
});

// Divider lines scale in
document.querySelectorAll('.reveal-line').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    scaleX: 1, duration: 0.8, ease: 'power2.out'
  });
});

// Generic cards/items that fade up
document.querySelectorAll('.reveal-up').forEach((el, i) => {
  const parent = el.parentElement;
  const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal-up'));
  const index = siblings.indexOf(el);

  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 90%' },
    opacity: 1, y: 0, duration: 0.6,
    delay: index * 0.1,
    ease: 'power2.out'
  });
});


// ===== TIMELINE =====

// Line draws down linked to scroll
gsap.to('#timelineTrack', {
  scrollTrigger: {
    trigger: '.timeline',
    start: 'top 85%',
    end: 'bottom 60%',
    scrub: 1
  },
  height: '100%',
  ease: 'none'
});

// Timeline items fade in and light up
document.querySelectorAll('.reveal-tl').forEach((item, i) => {
  gsap.to(item, {
    scrollTrigger: { trigger: item, start: 'top 88%' },
    opacity: 1, y: 0, duration: 0.5,
    delay: i * 0.06,
    ease: 'power2.out',
    onComplete: () => item.classList.add('lit')
  });
});


// ===== REGISTRY LINKS =====
document.querySelectorAll('.registry-link').forEach((link, i) => {
  gsap.to(link, {
    scrollTrigger: { trigger: link, start: 'top 90%' },
    opacity: 1, y: 0, duration: 0.5,
    delay: i * 0.1,
    ease: 'power2.out'
  });
});


// ===== GOLD PARTICLES =====
const particleContainer = document.getElementById('particles');
for (let i = 0; i < 10; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = (10 + Math.random() * 80) + '%';
  p.style.top = (Math.random() * 100) + '%';
  particleContainer.appendChild(p);

  gsap.to(p, {
    opacity: 0.08 + Math.random() * 0.08,
    y: -25 - Math.random() * 35,
    duration: 5 + Math.random() * 5,
    repeat: -1, yoyo: true,
    ease: 'sine.inOut',
    delay: Math.random() * 6
  });
}


// ===== NAV AUTO-HIDE (with debounce) =====
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  const y = window.scrollY;
  const delta = y - lastScrollY;
  // Only toggle if scroll delta > 5px to prevent jitter
  if (Math.abs(delta) > 5) {
    nav.style.transform = (delta > 0 && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
    // Close mobile menu on scroll
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('active');
    }
    lastScrollY = y;
  }
}, { passive: true });

// ===== MOBILE HAMBURGER MENU =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  });
});


// ===== COUNTDOWN TIMER =====
const weddingDate = new Date('2027-01-24T17:00:00-05:00'); // 5 PM EST
function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) {
    document.getElementById('heroCountdown').innerHTML = '<span class="countdown-label" style="font-size:14px;letter-spacing:3px;">Today is the day!</span>';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  document.getElementById('countDays').textContent = days;
  document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('countMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('countSecs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);


// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===== ATTENDING TOGGLE =====
const attendingDetails = document.getElementById('attendingDetails');
function setAttending(btn) {
  const group = btn.parentElement;
  group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rsvpAttending').value = btn.dataset.value;
  if (btn.dataset.value === 'no') {
    attendingDetails.classList.add('hidden');
    attendingDetails.style.maxHeight = '0';
  } else {
    attendingDetails.classList.remove('hidden');
    attendingDetails.style.maxHeight = attendingDetails.scrollHeight + 'px';
  }
}
// Initialize max-height for smooth transition
if (attendingDetails) {
  requestAnimationFrame(() => {
    attendingDetails.style.maxHeight = attendingDetails.scrollHeight + 'px';
  });
}


// ===== TOGGLE BUTTONS =====
function setGuestCount(btn) {
  const group = btn.parentElement;
  group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rsvpGuests').value = btn.dataset.value;
}

// ===== RSVP FORM =====
const rsvpForm = document.getElementById('rsvpForm');
const rsvpMessage = document.getElementById('rsvpMessage');
const rsvpBtn = document.getElementById('rsvpBtn');

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btnText = rsvpBtn.querySelector('.btn-text');
  const btnLoading = rsvpBtn.querySelector('.btn-loading');
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  rsvpBtn.disabled = true;
  rsvpMessage.textContent = '';
  rsvpMessage.className = 'rsvp-message';

  const isDeclined = document.getElementById('rsvpAttending').value === 'no';
  const eventWelcome = isDeclined ? false : document.getElementById('eventWelcome').checked;
  const eventWedding = isDeclined ? false : document.getElementById('eventWedding').checked;
  const eventBrunch = isDeclined ? false : document.getElementById('eventBrunch').checked;
  const anyEvent = eventWelcome || eventWedding || eventBrunch;

  const data = {
    full_name: document.getElementById('rsvpName').value.trim(),
    email: document.getElementById('rsvpEmail').value.trim(),
    attending: isDeclined ? 'declined' : (anyEvent ? 'accepted' : 'declined'),
    guest_count: isDeclined ? 1 : parseInt(document.getElementById('rsvpGuests').value, 10),
    meal_preference: isDeclined ? '' : document.getElementById('rsvpMeal').value,
    dietary_notes: document.getElementById('rsvpNotes').value.trim(),
    event_welcome: eventWelcome,
    event_wedding: eventWedding,
    event_brunch: eventBrunch,
  };

  if (!data.full_name) {
    rsvpMessage.textContent = 'Please enter your name.';
    rsvpMessage.className = 'rsvp-message error';
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    rsvpBtn.disabled = false;
    return;
  }

  if (!data.email) {
    rsvpMessage.textContent = 'Please enter your email address.';
    rsvpMessage.className = 'rsvp-message error';
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    rsvpBtn.disabled = false;
    return;
  }

  if (!isDeclined && anyEvent && !data.meal_preference) {
    rsvpMessage.textContent = 'Please select a meal preference.';
    rsvpMessage.className = 'rsvp-message error';
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    rsvpBtn.disabled = false;
    return;
  }

  try {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      rsvpMessage.textContent = anyEvent
        ? 'Thank you! We can\'t wait to celebrate with you.'
        : 'We\'ll miss you! Thank you for letting us know.';
      rsvpMessage.className = 'rsvp-message success';
      rsvpForm.reset();
      // Reset toggles
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.toggle-btn[data-value="1"]').classList.add('active');
      document.querySelector('#attendingGroup .toggle-btn[data-value="yes"]').classList.add('active');
      document.getElementById('rsvpGuests').value = '1';
      document.getElementById('rsvpAttending').value = 'yes';
      attendingDetails.classList.remove('hidden');
      attendingDetails.style.maxHeight = attendingDetails.scrollHeight + 'px';
    } else {
      rsvpMessage.textContent = result.error || 'Something went wrong. Please try again.';
      rsvpMessage.className = 'rsvp-message error';
    }
  } catch (err) {
    rsvpMessage.textContent = 'Unable to submit. Please check your connection and try again.';
    rsvpMessage.className = 'rsvp-message error';
  }

  btnText.style.display = 'inline';
  btnLoading.style.display = 'none';
  rsvpBtn.disabled = false;
});


// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let galleryImages = [
  "/images/gallery/full/CS9A1866.jpg",
  "/images/gallery/full/CS9A1942.jpg",
  "/images/gallery/full/CS9A1955.jpg",
  "/images/gallery/full/CS9A2000.jpg",
  "/images/gallery/full/CS9A2092.jpg",
  "/images/gallery/full/CS9A1839.jpg",
  "/images/gallery/full/CS9A1904.jpg",
  "/images/gallery/full/CS9A2170.jpg",
  "/images/gallery/full/CS9A1848.jpg",
  "/images/gallery/full/CS9A1849.jpg",
  "/images/gallery/full/CS9A1866.jpg",
  "/images/gallery/full/CS9A1870.jpg",
  "/images/gallery/full/CS9A1877.jpg",
  "/images/gallery/full/CS9A1886.jpg",
  "/images/gallery/full/CS9A1890.jpg",
  "/images/gallery/full/CS9A1891.jpg",
  "/images/gallery/full/CS9A1892.jpg",
  "/images/gallery/full/CS9A1894.jpg",
  "/images/gallery/full/CS9A1899.jpg",
  "/images/gallery/full/CS9A1902.jpg",
  "/images/gallery/full/CS9A1903.jpg",
  "/images/gallery/full/CS9A1909.jpg",
  "/images/gallery/full/CS9A1911.jpg",
  "/images/gallery/full/CS9A1912.jpg",
  "/images/gallery/full/CS9A1914.jpg",
  "/images/gallery/full/CS9A1915.jpg",
  "/images/gallery/full/CS9A1918.jpg",
  "/images/gallery/full/CS9A1921.jpg",
  "/images/gallery/full/CS9A1923.jpg",
  "/images/gallery/full/CS9A1929.jpg",
  "/images/gallery/full/CS9A1931.jpg",
  "/images/gallery/full/CS9A1933.jpg",
  "/images/gallery/full/CS9A1935.jpg",
  "/images/gallery/full/CS9A1947.jpg",
  "/images/gallery/full/CS9A1948.jpg",
  "/images/gallery/full/CS9A1951.jpg",
  "/images/gallery/full/CS9A1952.jpg",
  "/images/gallery/full/CS9A1958.jpg",
  "/images/gallery/full/CS9A1967.jpg",
  "/images/gallery/full/CS9A1974.jpg",
  "/images/gallery/full/CS9A1986.jpg",
  "/images/gallery/full/CS9A1990.jpg",
  "/images/gallery/full/CS9A1996.jpg",
  "/images/gallery/full/CS9A2005.jpg",
  "/images/gallery/full/CS9A2010.jpg",
  "/images/gallery/full/CS9A2012.jpg",
  "/images/gallery/full/CS9A2015.jpg",
  "/images/gallery/full/CS9A2016.jpg",
  "/images/gallery/full/CS9A2027.jpg",
  "/images/gallery/full/CS9A2034.jpg",
  "/images/gallery/full/CS9A2035.jpg",
  "/images/gallery/full/CS9A2040.jpg",
  "/images/gallery/full/CS9A2045.jpg",
  "/images/gallery/full/CS9A2047.jpg",
  "/images/gallery/full/CS9A2049.jpg",
  "/images/gallery/full/CS9A2055.jpg",
  "/images/gallery/full/CS9A2057.jpg",
  "/images/gallery/full/CS9A2067.jpg",
  "/images/gallery/full/CS9A2103.jpg",
  "/images/gallery/full/CS9A2121.jpg",
  "/images/gallery/full/CS9A2126.jpg",
  "/images/gallery/full/CS9A2128.jpg",
  "/images/gallery/full/CS9A2130.jpg",
  "/images/gallery/full/CS9A2132.jpg",
  "/images/gallery/full/CS9A2143.jpg",
  "/images/gallery/full/CS9A2145.jpg",
  "/images/gallery/full/CS9A2147.jpg",
  "/images/gallery/full/CS9A2150.jpg",
  "/images/gallery/full/CS9A2161.jpg"
];
let currentImageIndex = 0;
let galleryExpanded = false;

// ===== VIEW ALL PHOTOS =====
const galleryGrid = document.getElementById('galleryGrid');
const showAllBtn = document.getElementById('galleryShowAll');

showAllBtn.addEventListener('click', () => {
  if (galleryExpanded) return;
  galleryExpanded = true;

  // Add remaining images as thumbnails
  const existingCount = galleryGrid.querySelectorAll('.gallery-img').length;
  galleryImages.slice(existingCount).forEach((src, i) => {
    const thumbSrc = src.replace('/full/', '/thumbs/');
    const div = document.createElement('div');
    div.className = 'gallery-img';
    div.onclick = () => openLightbox(existingCount + i);
    const img = document.createElement('img');
    img.src = thumbSrc;
    img.alt = 'Engagement photo';
    img.loading = 'lazy';
    div.appendChild(img);
    galleryGrid.appendChild(div);

    // Animate in
    gsap.fromTo(div,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, delay: i * 0.03, ease: 'power2.out' }
    );
  });

  showAllBtn.textContent = `Showing All ${galleryImages.length} Photos`;
  showAllBtn.disabled = true;
  showAllBtn.style.opacity = '0.5';
  showAllBtn.style.cursor = 'default';
});

const lightboxCounter = document.getElementById('lightboxCounter');

function updateCounter() {
  lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

function openLightbox(index) {
  if (!galleryImages.length) return;
  currentImageIndex = index;
  lightboxImg.src = galleryImages[index];
  updateCounter();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => {
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImageIndex];
  updateCounter();
  preloadAdjacent();
});
document.getElementById('lightboxNext').addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImageIndex];
  updateCounter();
  preloadAdjacent();
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
  if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
});

// ===== LIGHTBOX TOUCH SWIPE =====
let touchStartX = 0;
let touchStartY = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    if (dx > 0) {
      document.getElementById('lightboxPrev').click();
    } else {
      document.getElementById('lightboxNext').click();
    }
  }
}, { passive: true });

// ===== LIGHTBOX IMAGE PRELOADING =====
function preloadAdjacent() {
  const prev = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  const next = (currentImageIndex + 1) % galleryImages.length;
  new Image().src = galleryImages[prev];
  new Image().src = galleryImages[next];
}
const origOpen = openLightbox;
openLightbox = function(index) {
  origOpen(index);
  preloadAdjacent();
};


// ===== SMOOTH SCROLL FOR NAV =====
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
