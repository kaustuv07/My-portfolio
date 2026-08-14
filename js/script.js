/* ============================================================
   KAUSTUV BARAL — CYBERPUNK PORTFOLIO
   script.js
   ------------------------------------------------------------
   Handles: typewriter, glitch flicker, sticky nav + active
   section, mobile menu, scroll-reveal, skill bars, expandable
   timeline, references toggle, cursor trail, Netrunner console,
   and the contact form (Formspree + mailto fallback).
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CONFIG — where YOU plug in your real links
     ---------------------------------------------------------- */
  const CONFIG = {
    // == CONTACT FORM ENDPOINT ==
    // Option A (recommended): create a free form at https://formspree.io,
    // then paste your form ID below, e.g. "https://formspree.io/f/abcxyz".
    // Option B (fallback, no backend): set to null — the form will open the
    // visitor's email app with the message pre-filled instead.
    FORM_ENDPOINT: 'https://formspree.io/f/xppalkqa',

    // == PASTE YOUR REAL PAST-WORKS URL HERE ==
    PAST_WORKS_URL: 'https://tinyurl.com/PastWork7777',
  };

  /* ----------------------------------------------------------
     2. UTILS
     ---------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     3. TYPEWRITER (hero tagline from the CV summary)
     ---------------------------------------------------------- */
  function initTypewriter() {
    const el = $('#typewriter');
    if (!el) return;

    const text = 'Data-driven campaigns. Social media. Paid ads. Content strategy. [initialize]';
    const caret = '<span class="typing-caret">▮</span>';

    if (prefersReduced) { el.innerHTML = text + caret; return; }

    let i = 0;
    (function type() {
      if (i <= text.length) {
        el.innerHTML = text.slice(0, i) + caret;
        i++;
        setTimeout(type, 32 + Math.random() * 28);
      }
    })();
  }

  /* ----------------------------------------------------------
     4. NAV — sticky state, active section, mobile menu
     ---------------------------------------------------------- */
  function initNav() {
    const nav = $('#nav');
    const toggle = $('#nav-toggle');
    const links = $('#nav-links');

    // sticky glow when scrolled
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // mobile menu toggle
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    // close mobile menu after choosing a link
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // highlight the section currently in view (IntersectionObserver)
    const sections = $$('.section, .hero');
    const linkMap = {};
    $$('.nav-links a').forEach((a) => {
      linkMap[a.dataset.section] = a;
    });

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        Object.values(linkMap).forEach((a) => a.classList.remove('active'));
        if (linkMap[id]) linkMap[id].classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((s) => spy.observe(s));
  }

  /* ----------------------------------------------------------
     5. SCROLL-REVEAL + SKILL BARS (IntersectionObserver)
     ---------------------------------------------------------- */
  function initReveal() {
    const sections = $$('.section, .hero');
    const cards = $$('.skill-card');

    // animate section titles + content into view
    sections.forEach((sec) => {
      $$('.section-title, .sub-title, .about-card, .timeline, .skill-grid, ' +
        '.edu-grid, .cert-card, .pages-grid, .contact-form, .works-btn, .section-lead, .ref-toggle', sec)
        .forEach((node) => node.classList.add('reveal'));
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    $$('.reveal').forEach((node) => obs.observe(node));

    // trigger skill bars (each card counts as its own observer target)
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    cards.forEach((c) => barObs.observe(c));
  }

  /* ----------------------------------------------------------
     6. EXPERIENCE TIMELINE — click to expand
     ---------------------------------------------------------- */
  function initTimeline() {
    $$('.tl-item').forEach((item) => {
      const head = $('.tl-node', item);
      const body = $('.tl-body', item);
      const btn = $('.tl-toggle', item);

      const open = () => {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      };
      const close = () => {
        item.classList.remove('open');
        body.style.maxHeight = '0px';
        btn.setAttribute('aria-expanded', 'false');
      };

      const toggle = () => (item.classList.contains('open') ? close() : open());

      head.addEventListener('click', toggle);
      btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

      // recalc height on window resize so expanded panels don't clip
      window.addEventListener('resize', () => {
        if (item.classList.contains('open')) body.style.maxHeight = body.scrollHeight + 'px';
      });
    });

    // open the most recent entry by default
    const first = $('.tl-item');
    if (first) first.querySelector('.tl-node').click();
  }

  /* ----------------------------------------------------------
     7. REFERENCES — toggle to reveal
     ---------------------------------------------------------- */
  function initReferences() {
    const btn = $('#ref-toggle');
    const panel = $('#ref-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const show = panel.hidden;
      panel.hidden = !show;
      btn.setAttribute('aria-expanded', String(show));
      btn.textContent = show ? '▾ HIDE REFERENCES' : '▸ TOGGLE REFERENCES';
    });
  }

  /* ----------------------------------------------------------
     8. CURSOR TRAIL (disabled on touch devices)
     ---------------------------------------------------------- */
  function initCursorTrail() {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine || prefersReduced) return;

    let last = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - last < 24) return;   // throttle for perf
      last = now;
      const d = document.createElement('span');
      d.className = 'trail-dot';
      d.style.left = e.clientX + 'px';
      d.style.top = e.clientY + 'px';
      document.body.appendChild(d);
      d.addEventListener('animationend', () => d.remove());
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     9. NETRUNNER TERMINAL — signature interactive element
     ---------------------------------------------------------- */
  function initConsole() {
    const launch = $('#console-launch');
    const con = $('#console');
    const close = $('#console-close');
    const body = $('#console-body');
    const input = $('#console-input');
    if (!launch || !con) return;

    const write = (html) => {
      const p = document.createElement('p');
      p.className = 'console-line';
      p.innerHTML = html;
      body.appendChild(p);
      body.scrollTop = body.scrollHeight;
    };

    const helpText = [
      'Available commands:',
      '  <span class="console-cmd">help</span>       show this list',
      '  <span class="console-cmd">whoami</span>     who is behind this site',
      '  <span class="console-cmd">skills</span>     list core skills',
      '  <span class="console-cmd">experience</span> jump to work history',
      '  <span class="console-cmd">education</span>  jump to education',
      '  <span class="console-cmd">contact</span>    jump to contact',
      '  <span class="console-cmd">works</span>      open past works archive',
      '  <span class="console-cmd">clear</span>      clear terminal',
      '  <span class="console-cmd">exit</span>       close terminal',
    ];

    const commands = {
      help: () => write(helpText.join('<br>')),
      whoami: () => write('&gt; Kaustuv Baral — Digital Marketing Executive.<br>&gt; Based in Balaju, Kathmandu. Data-driven, conversion-focused, relentlessly curious.'),
      skills: () => write('&gt; Meta Business Suite, CapCut Pro, Canva Pro, Photoshop,<br>&gt; AI Graphics &amp; Videos, Branding, Content Strategy, Paid Ads.'),
      experience: () => { scrollToId('experience'); write('&gt; Opening experience log…'); },
      education: () => { scrollToId('education'); write('&gt; Opening education file…'); },
      contact: () => { scrollToId('contact'); write('&gt; Opening comms channel…'); },
      works: () => { window.open(CONFIG.PAST_WORKS_URL, '_blank'); write('&gt; Redirecting to past works archive…'); },
      clear: () => { body.innerHTML = ''; },
      exit: () => closeConsole(),
    };

    const run = (raw) => {
      const cmd = raw.trim().toLowerCase();
      write('$ ' + raw);
      const fn = commands[cmd] || (() => write('&gt; <span style="color:var(--magenta)">unknown command</span>: "' + cmd + '". Type <span class="console-cmd">help</span>.'));
      fn();
    };

    const scrollToId = (id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    };

    const openConsole = () => { con.classList.add('open'); setTimeout(() => input.focus(), 120); };
    const closeConsole = () => { con.classList.remove('open'); input.value = ''; };

    launch.addEventListener('click', openConsole);
    close.addEventListener('click', closeConsole);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (input.value.trim()) run(input.value);
        input.value = '';
      } else if (e.key === 'Escape') {
        closeConsole();
      }
    });

    // close on outside click
    document.addEventListener('click', (e) => {
      if (con.classList.contains('open') && !con.contains(e.target) && e.target !== launch) {
        closeConsole();
      }
    });
  }

  /* ----------------------------------------------------------
     10. CONTACT FORM — validation + Formspree / mailto
     ---------------------------------------------------------- */
  function initForm() {
    const form = $('#contact-form');
    const status = $('#form-status');
    if (!form) return;

    const setStatus = (msg, type) => {
      status.textContent = msg;
      status.className = 'form-status' + (type ? ' ' + type : '');
    };

    const setField = (input, valid) => {
      const field = input.closest('.field');
      field.classList.toggle('invalid', !valid);
      return valid;
    };

    const validate = () => {
      let ok = true;

      const name = $('input[name="name"]', form);
      ok = setField(name, name.value.trim().length >= 2) && ok;

      const email = $('input[name="email"]', form);
      ok = setField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) && ok;

      const subject = $('input[name="subject"]', form);
      ok = setField(subject, subject.value.trim().length >= 2) && ok;

      const message = $('textarea[name="message"]', form);
      ok = setField(message, message.value.trim().length >= 10) && ok;

      return ok;
    };

    // live re-validate on input (clear red state as user types)
    $$('input, textarea', form).forEach((el) => {
      el.addEventListener('input', () => {
        if (el.closest('.field').classList.contains('invalid')) validate();
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validate()) {
        setStatus('⚠ TRANSMISSION FAILED — check the highlighted fields.', 'err');
        return;
      }

      const btn = $('.form-submit', form);
      const btnLabel = $('.btn-label', btn);
      btn.classList.add('busy');
      btnLabel.textContent = '▸ TRANSMITTING…';
      setStatus('');

      const payload = {
        name: $('input[name="name"]', form).value.trim(),
        email: $('input[name="email"]', form).value.trim(),
        subject: $('input[name="subject"]', form).value.trim(),
        message: $('textarea[name="message"]', form).value.trim(),
      };

      const success = () => {
        setStatus('✓ TRANSMISSION RECEIVED — I will reach out soon.', 'ok');
        form.reset();
        btn.classList.remove('busy');
        btnLabel.textContent = '▸ TRANSMIT';
      };
      const fail = () => {
        setStatus('⚠ UPLINK ERROR — please email me directly at kaustuvbaral18@gmail.com', 'err');
        btn.classList.remove('busy');
        btnLabel.textContent = '▸ TRANSMIT';
      };

      // --- Formspree path ---
      if (CONFIG.FORM_ENDPOINT) {
        try {
          const res = await fetch(CONFIG.FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
          });
          res.ok ? success() : fail();
        } catch (_) {
          fail();
        }
        return;
      }

      // --- mailto fallback path (no backend needed) ---
      const subject = encodeURIComponent(payload.subject);
      const body = encodeURIComponent(
        'Name: ' + payload.name + '\nEmail: ' + payload.email + '\n\n' + payload.message
      );
      const mailto = 'mailto:kaustuvbaral18@gmail.com?subject=' + subject + '&body=' + body;
      window.location.href = mailto;
      success();
    });
  }

  /* ----------------------------------------------------------
     11. PAGE LOGO FALLBACK — replaces a missing logo image
         with a styled initials badge (called from onerror)
     ---------------------------------------------------------- */
  window.logoFallback = function (img) {
    if (img.dataset.fallbackApplied) return; // only swap once
    img.dataset.fallbackApplied = '1';

    const initials = img.dataset.initials || 'BR';
    const badge = document.createElement('span');
    badge.className = 'page-logo page-logo-fallback';
    badge.textContent = initials;
    badge.setAttribute('aria-label', img.alt || 'Brand logo');

    img.replaceWith(badge);
  };

  /* ----------------------------------------------------------
     BOOT
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initNav();
    initReveal();
    initTimeline();
    initReferences();
    initCursorTrail();
    initConsole();
    initForm();
  });
})();