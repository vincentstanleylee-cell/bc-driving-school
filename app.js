/* BC Driving Master — shared site script.
 * Loaded by every page with <script src="./app.js" defer></script>.
 * Renders header/footer, hub search + roadmap tracker, checklists,
 * and the interactive simulators (activated by data-sim / data-* hooks).
 */
(function () {
  'use strict';

  var NAV = [
    { href: 'index.html', message: 'shared.navHome' },
    { href: 'cockpit.html', message: 'shared.navCockpit' },
    { href: 'driving-basics.html', message: 'shared.navDriving' },
    { href: 'intersections.html', message: 'shared.navIntersections' },
    { href: 'maneuvers.html', message: 'shared.navManeuvers' },
    { href: 'speed-zones.html', message: 'shared.navSpeed' },
    { href: 'hazard-perception.html', message: 'shared.navHazard' },
    { href: 'mock-test.html', message: 'shared.navMockTest' }
  ];
  var i18n = window.BCDM_I18N;
  var t = i18n.t;

  // Practice reference only. The official ICBC scoring sheet is the source of truth (see harness TASKS.md, VERIFY).
  var PRACTICE_PASS_LIMIT = 15;

  function currentPage() {
    var name = location.pathname.split('/').pop();
    if (!name) return 'index.html';
    return name.endsWith('.html') ? name : name + '.html';
  }

  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode: ignore */ }
  }

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function celebrate() {
    if (window.confetti) {
      window.confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    }
  }

  /* ---------- Header & footer ---------- */

  function renderHeader() {
    var host = document.getElementById('site-header');
    if (!host) return;
    var page = currentPage();

    if (!document.getElementById('bcdm-details-style')) {
      var st = document.createElement('style');
      st.id = 'bcdm-details-style';
      st.textContent = 'details summary::-webkit-details-marker { display: none; } details summary { list-style: none; }';
      document.head.appendChild(st);
    }

    var links = NAV.map(function (n) {
      var active = n.href === page;
      var cls = active
        ? 'bg-blue-50 text-blue-600 font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
      var aria = active ? ' aria-current="page"' : '';
      var rose = (n.href === 'mock-test.html' && !active) ? ' text-rose-600 font-semibold' : '';
      return '<a href="./' + n.href + '" data-i18n="' + n.message + '" class="px-2 py-2 rounded-lg whitespace-nowrap transition ' + cls + rose + '"' + aria + '></a>';
    });

    host.innerHTML =
      '<div class="bg-amber-500 text-slate-900 px-4 py-2 text-sm font-semibold shadow-sm">' +
        '<div class="container mx-auto flex items-center justify-between gap-2">' +
          '<span class="flex items-center gap-2"><i data-lucide="alert-triangle" class="w-4 h-4"></i>' +
          '<span data-i18n="shared.banner"></span></span>' +
          '<span data-i18n="shared.edition" class="hidden sm:inline text-xs bg-amber-600/30 px-2 py-0.5 rounded font-mono"></span>' +
        '</div>' +
      '</div>' +
      '<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">' +
        '<div class="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-3">' +
          '<a href="./index.html" class="flex items-center gap-2 sm:gap-3 min-w-0">' +
            '<div class="bg-blue-600 text-white p-1.5 sm:p-2 rounded-xl shadow-md shrink-0"><i data-lucide="car" class="w-6 h-6"></i></div>' +
            '<div class="min-w-0"><h1 class="font-bold text-base sm:text-lg text-slate-900 leading-tight">BC Driving Master</h1>' +
            '<p data-i18n="shared.subtitle" class="text-xs text-slate-500 truncate"></p></div>' +
          '</a>' +
          '<nav class="hidden xl:flex items-center gap-1 font-medium text-sm">' + links.join('') + '</nav>' +
          '<div class="flex items-center gap-2 shrink-0">' +
            i18n.createDropdownMarkup() +
            '<a href="./mock-test.html" class="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow transition hidden sm:flex xl:hidden items-center gap-2 shrink-0">' +
              '<i data-lucide="clipboard-check" class="w-4 h-4"></i>' +
              '<span data-i18n="shared.demeritSheet"></span>' +
            '</a>' +
            '<details class="xl:hidden relative shrink-0">' +
              '<summary class="list-none cursor-pointer bg-slate-100 hover:bg-slate-200 p-2 rounded-lg" data-i18n-aria-label="shared.menu"><i data-lucide="menu" class="w-5 h-5"></i></summary>' +
              '<div class="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 flex flex-col gap-1 text-sm z-50">' +
                links.join('') +
              '</div>' +
            '</details>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function renderFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;
    host.innerHTML =
      '<footer class="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-sm mt-auto">' +
        '<div class="container mx-auto px-4">' +
          '<p data-i18n="shared.footerTitle" class="text-slate-300 font-semibold mb-2"></p>' +
          '<p data-i18n="shared.footerNote" class="text-xs text-slate-500 max-w-3xl mx-auto"></p>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- Hub: search + roadmap tracker ---------- */

  function initHubSearch() {
    var input = document.getElementById('search');
    if (!input) return;
    var cards = document.querySelectorAll('[data-searchable]');
    var empty = document.getElementById('search-empty');
    function filter() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var hay = (card.getAttribute('data-keywords') || '') + ' ' + card.textContent;
        var match = !q || hay.toLowerCase().indexOf(q) !== -1;
        card.classList.toggle('hidden', !match);
        if (match) shown++;
      });
      if (empty) empty.classList.toggle('hidden', shown > 0);
    }
    input.addEventListener('input', filter);
    window.addEventListener('bcdm:langchange', filter);
  }

  function initRoadmap() {
    var boxes = document.querySelectorAll('input[data-milestone]');
    if (!boxes.length) return;
    var key = 'bcdm.roadmap';
    var done = load(key, []);
    var bar = document.getElementById('roadmap-bar');
    var count = document.getElementById('roadmap-count');
    var total = boxes.length;

    // Older saves used the default checkbox value and showed every milestone as checked.
    if (done.includes('on')) {
      done = Array.from(boxes, function (box) { return box.dataset.milestone; });
    }

    function render(announce) {
      var n = 0;
      boxes.forEach(function (box) {
        box.checked = done.includes(box.dataset.milestone);
        if (box.checked) n++;
        var row = box.closest('[data-milestone-row]');
        if (row) row.classList.toggle('bg-emerald-50', box.checked);
      });
      if (bar) bar.style.width = Math.round((n / total) * 100) + '%';
      if (count) count.textContent = t('home.roadmapCount', { done: n, total: total });
      if (announce && n === total) celebrate();
    }

    boxes.forEach(function (box) {
      box.addEventListener('change', function () {
        done = Array.from(boxes)
          .filter(function (b) { return b.checked; })
          .map(function (b) { return b.dataset.milestone; });
        store(key, done);
        render(true);
      });
    });
    window.addEventListener('bcdm:langchange', function () { render(false); });
    render(false);
  }

  /* ---------- Checklists (one per page, keyed by data-checklist id) ---------- */

  function initChecklists() {
    document.querySelectorAll('[data-checklist]').forEach(function (root) {
      var id = root.getAttribute('data-checklist');
      var key = 'bcdm.check.' + id;
      var boxes = root.querySelectorAll('input[type="checkbox"]');
      var checked = load(key, []);
      var count = root.querySelector('[data-checklist-count]');
      var bar = root.querySelector('[data-checklist-bar]');

      boxes.forEach(function (box, i) {
        box.checked = checked.indexOf(i) !== -1;
      });

      function render(announce) {
        var n = 0;
        boxes.forEach(function (box) { if (box.checked) n++; });
        if (count) count.textContent = n + ' / ' + boxes.length;
        if (bar) bar.style.width = Math.round((n / boxes.length) * 100) + '%';
        if (announce && n === boxes.length) celebrate();
      }

      boxes.forEach(function (box, i) {
        box.addEventListener('change', function () {
          checked = [];
          boxes.forEach(function (b, j) { if (b.checked) checked.push(j); });
          store(key, checked);
          render(true);
        });
      });

      var reset = root.querySelector('[data-checklist-reset]');
      if (reset) {
        reset.addEventListener('click', function () {
          checked = [];
          boxes.forEach(function (b) { b.checked = false; });
          store(key, checked);
          render(false);
        });
      }
      render(false);
    });
  }

  /* ---------- Simulator: steering wheel angle ---------- */

  function drawCar(ctx, cx, cy, angleRad, w, h, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 10);
    ctx.fill();
    ctx.restore();
  }

  function initSteering() {
    var canvas = document.getElementById('steer-canvas');
    var range = document.getElementById('steer-range');
    var readout = document.getElementById('steer-readout');
    if (!canvas || !range || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');

    function draw() {
      var wheel = Number(range.value);       // steering wheel degrees, -540..540
      var front = wheel / 16;                 // approximate road-wheel angle (16:1 ratio)
      var W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // road
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#fbbf24';
      ctx.setLineDash([18, 14]);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // car body (top-down, nose up)
      var cx = W / 2, cy = H / 2 + 20;
      var bodyW = 90, bodyH = 170;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, 18);
      ctx.fill();
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(-bodyW / 2 + 10, -bodyH / 2 + 30, bodyW - 20, 40); // windscreen
      ctx.restore();

      // front wheels rotated by road-wheel angle
      [-1, 1].forEach(function (side) {
        ctx.save();
        ctx.translate(cx + side * (bodyW / 2 + 2), cy - bodyH / 2 + 30);
        ctx.rotate(front * Math.PI / 180);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-9, -22, 18, 44);
        ctx.restore();
      });
      // rear wheels (fixed)
      [-1, 1].forEach(function (side) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx + side * (bodyW / 2 + 2) - 9, cy + bodyH / 2 - 52, 18, 44);
      });

      var angle = Math.abs(wheel);
      var direction = wheel === 0 ? 'steeringStraight' : (wheel < 0 ? 'steeringLeft' : 'steeringRight');
      var note = angle >= 360 ? 'steeringLarge' : (angle >= 90 ? 'steeringMedium' : 'steeringFine');
      if (readout) {
        readout.textContent = t('maneuvers.steeringReadout', {
          wheel: angle,
          direction: t('maneuvers.' + direction),
          front: Math.round(Math.abs(front) * 10) / 10
        });
      }
      var hint = document.getElementById('steer-hint');
      if (hint) hint.textContent = t('maneuvers.' + note);
    }

    range.addEventListener('input', draw);
    window.addEventListener('bcdm:langchange', draw);
    draw();
  }

  /* ---------- Simulator: blind spot detector ---------- */

  function initBlindSpot() {
    var canvas = document.getElementById('bs-canvas');
    var range = document.getElementById('bs-range');
    var check = document.getElementById('bs-check');
    var msg = document.getElementById('bs-msg');
    if (!canvas || !range || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');

    function draw() {
      var W = canvas.width, H = canvas.height;
      var otherY = Number(range.value);        // centre y of the car in the right lane
      var looked = !!(check && check.checked);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, W, H);
      // lane lines
      ctx.strokeStyle = '#f8fafc';
      ctx.setLineDash([16, 14]);
      ctx.lineWidth = 3;
      [W / 3, (2 * W) / 3].forEach(function (x) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      });
      ctx.setLineDash([]);

      // blind spot zone (right rear quarter of our car)
      var zone = { x: (2 * W) / 3 + 6, y: 120, w: W / 3 - 12, h: 130 };
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
      ctx.setLineDash([]);

      // our car (left lane)
      drawCar(ctx, W / 6, H / 2, 0, 56, 110, '#2563eb');

      // other car (right lane)
      var ocx = (5 * W) / 6, ocy = otherY;
      drawCar(ctx, ocx, ocy, 0, 56, 100, '#f59e0b');

      var overlap = Math.abs(ocy - (zone.y + zone.h / 2)) < (zone.h / 2 + 50);
      if (msg) {
        if (overlap && !looked) {
          msg.textContent = t('drivingBasics.blindSpotDanger');
          msg.className = 'mt-3 font-semibold text-rose-600';
        } else if (overlap && looked) {
          msg.textContent = t('drivingBasics.blindSpotWait');
          msg.className = 'mt-3 font-semibold text-amber-600';
        } else if (looked) {
          msg.textContent = t('drivingBasics.blindSpotClear');
          msg.className = 'mt-3 font-semibold text-emerald-600';
        } else {
          msg.textContent = t('drivingBasics.blindSpotCheck');
          msg.className = 'mt-3 font-semibold text-slate-600';
        }
      }
    }

    range.addEventListener('input', draw);
    if (check) check.addEventListener('change', draw);
    window.addEventListener('bcdm:langchange', draw);
    draw();
  }

  /* ---------- Simulator: parallel parking guide ---------- */

  function initParallel() {
    var canvas = document.getElementById('park-canvas');
    var buttons = document.querySelectorAll('[data-park-step]');
    var caption = document.getElementById('park-caption');
    if (!canvas || !buttons.length || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');

    var steps = {
      1: { cx: 330, cy: 175, a: 0 },
      2: { cx: 262, cy: 178, a: 0.7 },
      3: { cx: 215, cy: 200, a: 0.15 },
      4: { cx: 205, cy: 205, a: 0 }
    };
    var step = 1;

    function draw() {
      var W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, W, H);
      // road
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 0, W, 150);
      // curb
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 250, W, 30);
      // target car (parked)
      drawCar(ctx, 170, 205, 0, 100, 48, '#64748b');
      // our car at this step
      var s = steps[step];
      drawCar(ctx, s.cx, s.cy, s.a, 90, 46, '#2563eb');
      // dashed reference line at curb-parallel guide
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.moveTo(0, 228); ctx.lineTo(W, 228); ctx.stroke();
      ctx.setLineDash([]);
      if (caption) caption.textContent = t('maneuvers.parkCaption' + step);
      buttons.forEach(function (b) {
        var on = Number(b.dataset.parkStep) === step;
        b.classList.toggle('bg-blue-600', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('bg-slate-100', !on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        step = Number(b.dataset.parkStep);
        draw();
      });
    });
    window.addEventListener('bcdm:langchange', draw);
    draw();
  }

  /* ---------- Simulator: hill parking wheel direction ---------- */

  function initHill() {
    var radios = document.querySelectorAll('input[name="hill"]');
    if (!radios.length) return;
    var arrow = document.getElementById('hill-arrow');
    var direction = document.getElementById('hill-direction');
    var instructions = document.getElementById('hill-instructions');

    var rules = {
      'up-curb':   { left: true, message: 'maneuvers.hillUphillCurb' },
      'up-nocurb': { left: false, message: 'maneuvers.hillUphillNoCurb' },
      'down':      { left: false, message: 'maneuvers.hillDownhill' }
    };

    function render() {
      var checked = document.querySelector('input[name="hill"]:checked');
      var r = rules[checked ? checked.value : 'up-curb'];
      arrow.textContent = r.left ? '←' : '→';
      direction.textContent = t(r.left ? 'maneuvers.hillLeft' : 'maneuvers.hillRight');
      instructions.textContent = t(r.message);
    }

    radios.forEach(function (r) { r.addEventListener('change', render); });
    window.addEventListener('bcdm:langchange', render);
    render();
  }

  /* ---------- Hazard perception scene ---------- */

  function initHazard() {
    var spots = document.querySelectorAll('[data-hazard]');
    var score = document.getElementById('hazard-score');
    var feedback = document.getElementById('hazard-feedback');
    if (!spots.length) return;
    var total = spots.length;
    var found = new Set();
    var lastHazard;

    function render() {
      if (score) score.textContent = found.size + ' / ' + total;
      if (feedback) {
        var message = found.size === total ? 'completeFeedback' : (lastHazard ? lastHazard + 'Note' : 'startFeedback');
        feedback.textContent = t('hazardPerception.' + message);
      }
    }

    spots.forEach(function (spot) {
      spot.setAttribute('aria-pressed', 'false');
      spot.addEventListener('click', function () {
        var id = spot.dataset.hazard;
        if (found.has(id)) return;
        found.add(id);
        lastHazard = id;
        spot.classList.add('ring-4', 'ring-emerald-400', 'bg-emerald-400/30');
        spot.setAttribute('aria-pressed', 'true');
        render();
        if (found.size === total) celebrate();
      });
    });
    window.addEventListener('bcdm:langchange', render);
    render();
  }

  /* ---------- Mock test scorer ---------- */

  function initScorer() {
    var root = document.querySelector('[data-scorer]');
    if (!root) return;
    var fails = root.querySelectorAll('input[data-fail]');
    var demerits = root.querySelectorAll('input[data-demerit]');
    var result = document.getElementById('scorer-result');
    var detail = document.getElementById('scorer-detail');
    var reset = document.getElementById('scorer-reset');
    var key = 'bcdm.scorer';

    var saved = load(key, { fails: [], demerits: {} });

    fails.forEach(function (f, i) { f.checked = saved.fails.indexOf(i) !== -1; });
    demerits.forEach(function (d, i) { d.value = saved.demerits[i] || 0; });

    function save() {
      var f = [];
      fails.forEach(function (x, i) { if (x.checked) f.push(i); });
      var d = {};
      demerits.forEach(function (x, i) { d[i] = Number(x.value) || 0; });
      store(key, { fails: f, demerits: d });
    }

    function evaluate(announce) {
      var failCount = 0;
      fails.forEach(function (f) { if (f.checked) failCount++; });
      var points = 0;
      demerits.forEach(function (d) {
        var pts = Number(d.getAttribute('data-points')) || 0;
        points += pts * (Number(d.value) || 0);
      });
      var passed = failCount === 0 && points < PRACTICE_PASS_LIMIT;
      if (result) {
        var message = failCount > 0 ? 'resultAutoFail' : (passed ? 'resultPass' : 'resultDemerits');
        result.textContent = t('mockTest.' + message);
        result.className = 'text-2xl font-black ' + (passed ? 'text-emerald-600' : 'text-rose-600');
      }
      if (detail) {
        detail.textContent = t('mockTest.resultDetails', { fails: failCount, points: points, limit: PRACTICE_PASS_LIMIT });
      }
      if (announce && passed && points === 0) celebrate();
    }

    fails.forEach(function (f) { f.addEventListener('change', function () { save(); evaluate(true); }); });
    demerits.forEach(function (d) { d.addEventListener('input', function () { save(); evaluate(true); }); });
    if (reset) {
      reset.addEventListener('click', function () {
        fails.forEach(function (f) { f.checked = false; });
        demerits.forEach(function (d) { d.value = 0; });
        save();
        evaluate(true);
      });
    }
    window.addEventListener('bcdm:langchange', function () { evaluate(false); });
    evaluate(true);
  }

  /* ---------- Boot ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderFooter();
    i18n.initSwitcher();
    initHubSearch();
    initRoadmap();
    initChecklists();
    initSteering();
    initBlindSpot();
    initParallel();
    initHill();
    initHazard();
    initScorer();
    if (window.lucide) window.lucide.createIcons();
  });
})();
