/* ===== thezapins.com - Stephanie & Corey ===== */

gsap.registerPlugin(ScrollTrigger);

// ===== HERO ENTRANCE ANIMATION =====
const heroTL = gsap.timeline({ delay: 0.4 });

heroTL
  .to('.corner', { opacity: 1, duration: 1, stagger: 0.08, ease: 'power1.out' })
  .to('#nib', { opacity: 0.85, duration: 0.15 }, 0.6)
  .to('#nib', { left: '95%', duration: 3.8, ease: 'power1.inOut' }, 0.6)
  .to('#sigText', { clipPath: 'inset(0 0% 0 0)', duration: 3.8, ease: 'power1.inOut' }, 0.6)
  .to('#nib', { opacity: 0, duration: 0.4 }, 4.2)
  .to('#heroDivider', { scaleX: 1, duration: 1, ease: 'power2.out' }, 4)
  .to('#heroDate', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 4.3)
  .to('#heroVenue', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 4.5)
  .to('#heroDress', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 4.7)
  .to('#scrollHint', { opacity: 1, duration: 1 }, 5.2);


// ===== HERO PARALLAX ON SCROLL =====
gsap.to('#heroBg', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  y: 100
});

gsap.to('#heroContent', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: 1 },
  y: -50, opacity: 0
});

// Corners drift outward
const cornerDirs = [
  { sel: '.corner.tl', x: -12, y: -12 },
  { sel: '.corner.tr', x: 12, y: -12 },
  { sel: '.corner.bl', x: -12, y: 12 },
  { sel: '.corner.br', x: 12, y: 12 },
];
cornerDirs.forEach(({ sel, x, y }) => {
  gsap.to(sel, {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    x, y, opacity: 0
  });
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


// ===== NAV AUTO-HIDE =====
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  const y = window.scrollY;
  nav.style.transform = (y > lastScrollY && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
  lastScrollY = y;
}, { passive: true });


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

  const eventWelcome = document.getElementById('eventWelcome').checked;
  const eventWedding = document.getElementById('eventWedding').checked;
  const eventBrunch = document.getElementById('eventBrunch').checked;
  const anyEvent = eventWelcome || eventWedding || eventBrunch;

  const data = {
    full_name: document.getElementById('rsvpName').value.trim(),
    email: document.getElementById('rsvpEmail').value.trim(),
    attending: anyEvent ? 'accepted' : 'declined',
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
      // Reset toggle to "Just Me"
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.toggle-btn[data-value="1"]').classList.add('active');
      document.getElementById('rsvpGuests').value = '1';
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
let galleryImages = [];
let currentImageIndex = 0;

function openLightbox(index) {
  if (!galleryImages.length) return;
  currentImageIndex = index;
  lightboxImg.src = galleryImages[index];
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
});
document.getElementById('lightboxNext').addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImageIndex];
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
