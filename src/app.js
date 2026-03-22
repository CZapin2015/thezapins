/* ===== thezapins.com - Stephanie & Corey ===== */

gsap.registerPlugin(ScrollTrigger);

// Safety net: if ScrollTrigger fails or bfcache restores page, force all elements visible
function forceRevealAll() {
  document.querySelectorAll('.reveal, .reveal-line, .reveal-up, .reveal-tl, .rsvp-form, .hotel-card, .registry-link, .gallery-img, .venue-map, .travel-info').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
// bfcache restore (iOS Safari back/forward)
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    forceRevealAll();
    ScrollTrigger.refresh();
  }
});
// Fallback timeout - if elements are still hidden after 4s, force them visible
setTimeout(() => {
  document.querySelectorAll('.reveal, .reveal-up, .reveal-tl').forEach(el => {
    if (getComputedStyle(el).opacity === '0') forceRevealAll();
  });
}, 4000);

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
  gsap.set(['#heroDate', '#heroVenue', '#scrollHint'], { opacity: 0, y: 6 });

  const heroTL = gsap.timeline({ delay: 0.2 });

  heroTL
    .to('.corner', { opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power1.out' })
    .to('#sigText', { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power3.out' }, 0.25)
    // Subtle glow pulse on names after reveal
    .to('#sigText', { textShadow: '0 3px 24px rgba(0,0,0,0.6), 0 0 60px rgba(201,169,110,0.2)', duration: 0.8, ease: 'power2.out' }, 1.8)
    .to('#sigText', { textShadow: '0 3px 24px rgba(0,0,0,0.6), 0 0 30px rgba(201,169,110,0.08)', duration: 1.2, ease: 'power2.out' }, 2.4)
    // Details appear
    .to('#heroDivider', { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 1.85)
    .to('#heroDate', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.0)
    .to('#heroVenue', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.1)
    // Countdown cards float in with stagger
    .from('.countdown-unit', { opacity: 0, y: 15, scale: 0.9, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 2.2)
    .to('#scrollHint', { opacity: 1, duration: 0.5 }, 2.7);
}
// If scrolled past hero on load: everything is already visible via CSS defaults


// ===== HERO PARALLAX ON SCROLL =====
// Only parallax the background -- content scrolls off naturally
gsap.to('#heroBg', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  y: 100
});


// ===== SECTION REVEAL ANIMATIONS =====

// Titles and subtitles fade up with scale
document.querySelectorAll('.reveal').forEach(el => {
  gsap.set(el, { scale: 0.96 });
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out'
  });
});

// Divider lines and flourishes scale in
document.querySelectorAll('.reveal-line').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out'
  });
});

// Generic cards/items that fade up with scale
document.querySelectorAll('.reveal-up').forEach((el, i) => {
  const parent = el.parentElement;
  const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal-up'));
  const index = siblings.indexOf(el);

  gsap.set(el, { scale: 0.95 });
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 90%' },
    opacity: 1, y: 0, scale: 1, duration: 0.7,
    delay: index * 0.12,
    ease: 'power2.out'
  });
});


// ===== TIMELINE =====

// Timeline line draws down linked to scroll
gsap.to('#timelineLine', {
  scrollTrigger: {
    trigger: '.event-timeline',
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
    delay: i * 0.15,
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
for (let i = 0; i < 24; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = 1.5 + Math.random() * 2;
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  p.style.left = (5 + Math.random() * 90) + '%';
  p.style.top = (Math.random() * 100) + '%';
  particleContainer.appendChild(p);

  gsap.to(p, {
    opacity: 0.08 + Math.random() * 0.14,
    y: -30 - Math.random() * 50,
    x: -10 + Math.random() * 20,
    duration: 5 + Math.random() * 7,
    repeat: -1, yoyo: true,
    ease: 'sine.inOut',
    delay: Math.random() * 6
  });
}


// ===== MOBILE HAMBURGER MENU =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// ===== CLOSE MOBILE MENU ON SCROLL =====
window.addEventListener('scroll', () => {
  if (navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  }
}, { passive: true });

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


// ===== ATTENDANCE TOGGLE =====
function setAttendance(btn) {
  const group = btn.parentElement;
  group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rsvpAttendance').value = btn.dataset.value;
  const attendingFields = document.getElementById('attendingFields');
  const declineMsg = document.getElementById('declineMessage');
  if (btn.dataset.value === 'decline') {
    attendingFields.classList.add('hidden');
    declineMsg.classList.add('visible');
  } else {
    attendingFields.classList.remove('hidden');
    declineMsg.classList.remove('visible');
  }
}

// ===== GUEST COUNT TOGGLE =====
function setGuestCount(btn) {
  const group = btn.parentElement;
  group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rsvpGuests').value = btn.dataset.value;
  const guestSection = document.getElementById('guestSection');
  if (btn.dataset.value === '2') {
    guestSection.classList.add('visible');
  } else {
    guestSection.classList.remove('visible');
  }
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

  const eventWelcome = document.getElementById('eventWelcome').checked;
  const eventWedding = document.getElementById('eventWedding').checked;
  const eventBrunch = document.getElementById('eventBrunch').checked;
  const anyEvent = eventWelcome || eventWedding || eventBrunch;
  const isAccepting = document.getElementById('rsvpAttendance').value === 'accept';

  const data = {
    full_name: document.getElementById('rsvpName').value.trim(),
    email: document.getElementById('rsvpEmail').value.trim(),
    attending: isAccepting ? 'accepted' : 'declined',
    guest_count: parseInt(document.getElementById('rsvpGuests').value, 10),
    meal_preference: document.getElementById('rsvpMeal').value,
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

  if (isAccepting && !anyEvent) {
    rsvpMessage.textContent = 'Please select at least one event you\'ll be attending.';
    rsvpMessage.className = 'rsvp-message error';
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    rsvpBtn.disabled = false;
    return;
  }

  if (anyEvent && !data.meal_preference) {
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
      const msg = isAccepting
        ? 'Thank you! We can\'t wait to celebrate with you.'
        : 'We\'ll miss you! Thank you for letting us know.';
      // Collapse the entire form and show just the confirmation
      rsvpForm.style.transition = 'opacity 0.4s ease, max-height 0.5s ease';
      rsvpForm.style.opacity = '0';
      setTimeout(() => {
        rsvpForm.style.maxHeight = '0';
        rsvpForm.style.overflow = 'hidden';
        rsvpForm.style.padding = '0';
        rsvpForm.style.border = 'none';
        rsvpForm.style.margin = '0';
        rsvpMessage.textContent = msg;
        rsvpMessage.className = 'rsvp-message success';
        rsvpMessage.style.fontSize = '22px';
        rsvpMessage.style.marginTop = '20px';
      }, 400);
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
  "/images/gallery/full/CS9A1848.jpg",
  "/images/gallery/full/CS9A1870.jpg",
  "/images/gallery/full/CS9A1866.jpg",
  "/images/gallery/full/CS9A2049.jpg",
  "/images/gallery/full/CS9A1890.jpg",
  "/images/gallery/full/CS9A1909.jpg",
  "/images/gallery/full/CS9A1931.jpg",
  "/images/gallery/full/CS9A1892.jpg",
  "/images/gallery/full/CS9A1894.jpg",
  "/images/gallery/full/CS9A1918.jpg",
  "/images/gallery/full/CS9A1911.jpg",
  "/images/gallery/full/CS9A1942.jpg",
  "/images/gallery/full/CS9A1902.jpg",
  "/images/gallery/full/CS9A1933.jpg",
  "/images/gallery/full/CS9A1935.jpg",
  "/images/gallery/full/CS9A1903.jpg",
  "/images/gallery/full/CS9A1904.jpg",
  "/images/gallery/full/CS9A1947.jpg",
  "/images/gallery/full/CS9A1948.jpg",
  "/images/gallery/full/CS9A1955.jpg",
  "/images/gallery/full/CS9A1958.jpg",
  "/images/gallery/full/CS9A1974.jpg",
  "/images/gallery/full/CS9A1986.jpg",
  "/images/gallery/full/CS9A2000.jpg",
  "/images/gallery/full/CS9A2010.jpg",
  "/images/gallery/full/CS9A2015.jpg",
  "/images/gallery/full/CS9A2027.jpg",
  "/images/gallery/full/CS9A1996.jpg",
  "/images/gallery/full/CS9A1921.jpg",
  "/images/gallery/full/CS9A1967.jpg",
  "/images/gallery/full/CS9A2040.jpg",
  "/images/gallery/full/CS9A2045.jpg",
  "/images/gallery/full/CS9A2047.jpg",
  "/images/gallery/full/CS9A1951.jpg",
  "/images/gallery/full/CS9A1914.jpg",
  "/images/gallery/full/CS9A2012.jpg",
  "/images/gallery/full/CS9A1990.jpg",
  "/images/gallery/full/CS9A2161.jpg",
  "/images/gallery/full/CS9A2092.jpg",
  "/images/gallery/full/CS9A2103.jpg",
  "/images/gallery/full/CS9A2055.jpg",
  "/images/gallery/full/CS9A2057.jpg",
  "/images/gallery/full/CS9A2067.jpg",
  "/images/gallery/full/CS9A2143.jpg",
  "/images/gallery/full/CS9A2147.jpg",
  "/images/gallery/full/CS9A2130.jpg",
  "/images/gallery/full/CS9A2150.jpg",
  "/images/gallery/full/CS9A2170.jpg"
];
let currentImageIndex = 0;

const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxProgressBar = document.getElementById('lightboxProgressBar');

function updateUI() {
  lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
  lightboxProgressBar.style.width = `${((currentImageIndex + 1) / galleryImages.length) * 100}%`;
}

function preloadAdjacent() {
  [-1, 1, 2].forEach(offset => {
    const i = (currentImageIndex + offset + galleryImages.length) % galleryImages.length;
    const img = new Image();
    img.src = galleryImages[i];
  });
}

function navigateTo(index) {
  lightboxImg.classList.add('fading');
  setTimeout(() => {
    currentImageIndex = index;
    lightboxImg.src = galleryImages[index];
    lightboxImg.onload = () => {
      lightboxImg.classList.remove('fading');
      preloadAdjacent();
    };
    updateUI();
  }, 150);
}

function openLightbox(index) {
  if (!galleryImages.length) return;
  currentImageIndex = index;
  lightboxImg.src = galleryImages[index];
  lightboxImg.classList.remove('fading');
  updateUI();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  preloadAdjacent();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => {
  navigateTo((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
});
document.getElementById('lightboxNext').addEventListener('click', () => {
  navigateTo((currentImageIndex + 1) % galleryImages.length);
});

// Click backdrop to close
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrap')) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateTo((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
  if (e.key === 'ArrowRight') navigateTo((currentImageIndex + 1) % galleryImages.length);
});

// Touch swipe support
(function() {
  const wrap = document.querySelector('.lightbox-img-wrap');
  if (!wrap) return;
  let startX = 0, startY = 0, moved = false;
  wrap.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    moved = false;
  }, { passive: true });
  wrap.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) moved = true;
  }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (!moved) return;
    if (dx < -50) navigateTo((currentImageIndex + 1) % galleryImages.length);
    else if (dx > 50) navigateTo((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
  });
})();


// ===== RSVP FEATURE FLAG =====
fetch('/api/settings')
  .then(r => r.json())
  .then(settings => {
    if (!settings.rsvp_open) {
      const rsvpSection = document.getElementById('rsvp');
      if (rsvpSection) rsvpSection.style.display = 'none';
      const rsvpNav = document.querySelector('nav a[href="#rsvp"]');
      if (rsvpNav) rsvpNav.style.display = 'none';
    }
  })
  .catch(() => {
    // If settings fail to load, hide RSVP by default
    const rsvpSection = document.getElementById('rsvp');
    if (rsvpSection) rsvpSection.style.display = 'none';
    const rsvpNav = document.querySelector('nav a[href="#rsvp"]');
    if (rsvpNav) rsvpNav.style.display = 'none';
  });


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

// ===== COUNTDOWN =====
function updateCountdown() {
  const wedding = new Date('2027-01-24T17:00:00-05:00');
  const now = new Date();
  const diff = wedding - now;
  if (diff <= 0) return;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('cdDays').textContent = String(days).padStart(3, '0');
  document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);
