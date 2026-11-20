/**
 * Medical-Grade Vanilla JavaScript Animations
 * Zero-dependency, lightweight, high-performance IntersectionObserver & Counter utilities.
 */

// 1. Stats Counter Animation using requestAnimationFrame & Ease-Out
export function animateCounter(
  element: HTMLElement,
  targetValue: number,
  duration = 1800,
  prefix = '',
  suffix = ''
) {
  const startTimestamp = performance.now();

  function step(currentTimestamp: number) {
    const elapsed = currentTimestamp - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic curve: 1 - (1 - t)^3
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easeOutProgress * targetValue);

    element.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${targetValue.toLocaleString()}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

// 2. Observer for Stats Counter elements
export function initStatsCounters() {
  if (typeof window === 'undefined') return;

  const counterElements = document.querySelectorAll<HTMLElement>('[data-counter-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const targetStr = el.getAttribute('data-counter-target');
          if (!targetStr) return;

          const targetNum = parseInt(targetStr, 10);
          const prefix = el.getAttribute('data-counter-prefix') || '';
          const suffix = el.getAttribute('data-counter-suffix') || '';
          const duration = parseInt(el.getAttribute('data-counter-duration') || '1800', 10);

          if (!isNaN(targetNum)) {
            animateCounter(el, targetNum, duration, prefix, suffix);
          }

          obs.unobserve(el); // Fire only once for professional medical feel
        }
      });
    },
    { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
  );

  counterElements.forEach((el) => observer.observe(el));
}

// 3. Scroll Reveal Observer for Laboratory, Equipment & Section cards
export function initScrollReveal() {
  if (typeof window === 'undefined') return;

  const revealElements = document.querySelectorAll<HTMLElement>('.scroll-reveal:not(.revealed)');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) {
            setTimeout(() => {
              el.classList.add('revealed');
            }, parseInt(delay, 10));
          } else {
            el.classList.add('revealed');
          }
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// 4. Preloader Dismiss Handler
export function dismissPreloader(minDisplayTimeMs = 600) {
  if (typeof document === 'undefined') return;

  const preloader = document.getElementById('medical-preloader');
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add('preloader-hidden');
    setTimeout(() => {
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 600);
  }, minDisplayTimeMs);
}

// 5. Initialize all animations safely
export function initAllMedicalAnimations() {
  if (typeof window === 'undefined') return;
  initScrollReveal();
  initStatsCounters();
  dismissPreloader(500);
}
