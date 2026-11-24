/* BC Driving Master — shared site script.
 * Loaded by every page with <script src="./app.js" defer></script>.
 * Renders header/footer, hub search + roadmap tracker, checklists,
 * and the interactive simulators (activated by data-sim / data-* hooks).
 */
(function () {
  'use strict';

  var NAV = [
    { href: 'index.html', label: '首頁總覽' },
    { href: 'cockpit.html', label: '座艙檢查' },
    { href: 'driving-basics.html', label: '自動波技巧' },
    { href: 'intersections.html', label: '路口路權' },
    { href: 'maneuvers.html', label: '必考泊車' },
    { href: 'speed-zones.html', label: '限速特區' },
    { href: 'hazard-perception.html', label: '危險預判' },
    { href: 'mock-test.html', label: '即死位與模擬評分' }
  ];

  // Practice reference only. The official ICBC scoring sheet is the source of truth (see harness TASKS.md, VERIFY).
  var PRACTICE_PASS_LIMIT = 15;

  function currentPage() {
    var name = location.pathname.split('/').pop();
    return name && name.slice(-5) === '.html' ? name : 'index.html';
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

    var langDropdown = (window.BCDM_I18N && window.BCDM_I18N.createDropdownMarkup)
      ? window.BCDM_I18N.createDropdownMarkup()
      : '';

    var links = NAV.map(function (n) {
      var active = n.href === page;
      var cls = active
        ? 'bg-blue-50 text-blue-600 font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
      var aria = active ? ' aria-current="page"' : '';
      var rose = (n.href === 'mock-test.html' && !active) ? ' text-rose-600 font-semibold' : '';
      return '<a href="./' + n.href + '" class="px-3 py-2 rounded-lg transition ' + cls + rose + '"' + aria + '>' + n.label + '</a>';
    });

    host.innerHTML =
      '<div class="bg-amber-500 text-slate-900 px-4 py-2 text-sm font-semibold shadow-sm">' +
        '<div class="container mx-auto flex items-center justify-between gap-2">' +
          '<span class="flex items-center gap-2"><i data-lucide="alert-triangle" class="w-4 h-4"></i>' +
          '<span>ICBC 官方標準：卑詩省 Class 7 (N牌) 及 Class 5 全牌自動波路試專用課程</span></span>' +
          '<span class="hidden sm:inline text-xs bg-amber-600/30 px-2 py-0.5 rounded font-mono">2026 版</span>' +
        '</div>' +
      '</div>' +
      '<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">' +
        '<div class="container mx-auto px-4 h-16 flex items-center justify-between gap-3">' +
          '<a href="./index.html" class="flex items-center gap-3 min-w-0">' +
            '<div class="bg-blue-600 text-white p-2 rounded-xl shadow-md shrink-0"><i data-lucide="car" class="w-6 h-6"></i></div>' +
            '<div class="min-w-0"><h1 class="font-bold text-lg text-slate-900 leading-tight">BC Driving Master</h1>' +
            '<p class="text-xs text-slate-500 truncate">ICBC 自動波路試通關全指南</p></div>' +
          '</a>' +
          '<nav class="hidden lg:flex items-center gap-1 font-medium text-sm">' + links.join('') + '</nav>' +
          '<div class="flex items-center gap-2">' +
            langDropdown +
            '<a href="./mock-test.html" class="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow transition hidden sm:flex items-center gap-2 shrink-0">' +
              '<i data-lucide="clipboard-check" class="w-4 h-4"></i>' +
              '<span>考官扣分清單</span>' +
            '</a>' +
            '<details class="lg:hidden relative">' +
              '<summary class="list-none cursor-pointer bg-slate-100 hover:bg-slate-200 p-2 rounded-lg" aria-label="選單"><i data-lucide="menu" class="w-5 h-5"></i></summary>' +
              '<div class="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 flex flex-col gap-1 text-sm z-50">' +
                '<div class="pb-2 mb-1 border-b border-slate-100 px-2 flex items-center justify-between">' +
                  '<span class="text-xs font-semibold text-slate-500">切換語言 / Language</span>' +
                '</div>' +
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
          '<p class="text-slate-300 font-semibold mb-2">BC Driving Master · 卑詩省 ICBC 自動波私家車路考自學手冊</p>' +
          '<p class="text-xs text-slate-500 max-w-3xl mx-auto">本網站為自學參考，並非 ICBC 官方產品。考試標準以 ICBC 最新《Learn to Drive Smart》及路試評分表為準。' +
          '圖片來自 Unsplash，僅作示意。</p>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- Hub: search + roadmap tracker ---------- */

  function initHubSearch() {
    var input = document.getElementById('search');
    if (!input) return;
    var cards = document.querySelectorAll('[data-searchable]');
    var empty = document.getElementById('search-empty');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var hay = (card.getAttribute('data-keywords') || '') + ' ' + card.textContent;
        var match = !q || hay.toLowerCase().indexOf(q) !== -1;
        card.classList.toggle('hidden', !match);
        if (match) shown++;
      });
      if (empty) empty.classList.toggle('hidden', shown > 0);
    });
  }

  function initRoadmap() {
    var boxes = document.querySelectorAll('input[data-milestone]');
    if (!boxes.length) return;
    var key = 'bcdm.roadmap';
    var done = load(key, []);
    var bar = document.getElementById('roadmap-bar');
    var count = document.getElementById('roadmap-count');
    var total = boxes.length;

    function render(announce) {
      var n = 0;
      boxes.forEach(function (box) {
        box.checked = done.indexOf(box.value) !== -1;
        if (box.checked) n++;
        var row = box.closest('[data-milestone-row]');
        if (row) row.classList.toggle('bg-emerald-50', box.checked);
      });
      if (bar) bar.style.width = Math.round((n / total) * 100) + '%';
      var suffix = (window.BCDM_I18N && window.BCDM_I18N.t) ? window.BCDM_I18N.t('已完成') : '已完成';
      if (count) count.textContent = n + ' / ' + total + ' ' + suffix;
      if (announce && n === total) celebrate();
    }

    boxes.forEach(function (box) {
      box.addEventListener('change', function () {
        done = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).map(function (b) { return b.value; });
        store(key, done);
        render(true);
      });
    });
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
        var prefix = (window.BCDM_I18N && window.BCDM_I18N.t) ? window.BCDM_I18N.t('完成進度') : '完成進度';
        if (count) count.textContent = prefix + ' ' + n + ' / ' + boxes.length;
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

      var dir = wheel === 0 ? '正中（直行）' : (wheel < 0 ? '向左' : '向右');
      var note = Math.abs(wheel) >= 360
        ? '大幅打方向：只適用於泊車或掉頭，行車中必須回正。'
        : (Math.abs(wheel) >= 90 ? '打方向較大：注意時速與後方盲點。' : '細微修正：保持平穩，雙手在方向盤上。');
      if (readout) {
        readout.textContent = '方向盤 ' + Math.abs(wheel) + '° ' + dir + '　｜　前輪約 ' + Math.abs(Math.round(front * 10) / 10) + '°';
      }
      var hint = document.getElementById('steer-hint');
      if (hint) hint.textContent = note;
    }

    range.addEventListener('input', draw);
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
          msg.textContent = '危險：右方來車在盲點內。未扭頭前，禁止切入。';
          msg.className = 'mt-3 font-semibold text-rose-600';
        } else if (overlap && looked) {
          msg.textContent = '已扭頭確認：來車仍在盲點，請等待它通過後再切入。';
          msg.className = 'mt-3 font-semibold text-amber-600';
        } else if (looked) {
          msg.textContent = '安全：已扭頭確認盲點無車。打燈後平穩切入。';
          msg.className = 'mt-3 font-semibold text-emerald-600';
        } else {
          msg.textContent = '盲點暫無車，但考試規定仍須扭頭（Shoulder Check）才可切線。';
          msg.className = 'mt-3 font-semibold text-slate-600';
        }
      }
    }

    range.addEventListener('input', draw);
    if (check) check.addEventListener('change', draw);
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
      1: { cx: 330, cy: 175, a: 0,    text: '第 1 步：與目標車並排約 1 公尺，後視鏡對齊，入 R 檔，打右燈，360 度環視 + 右後扭頭。' },
      2: { cx: 262, cy: 178, a: 0.7,  text: '第 2 步：倒後直行，車尾與目標車尾切齊後，方向盤迅速向右打一圈，倒至車身約 45 度。' },
      3: { cx: 215, cy: 200, a: 0.15, text: '第 3 步：回正方向盤直倒，直到右側後視鏡見到前車左後尾燈。' },
      4: { cx: 205, cy: 205, a: 0,    text: '第 4 步：方向盤迅速向左打到底，平穩入位，回正車身，離路緣約 30 厘米，入 P 檔拉手煞車。' }
    };

    function draw(n) {
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
      var s = steps[n];
      drawCar(ctx, s.cx, s.cy, s.a, 90, 46, '#2563eb');
      // dashed reference line at curb-parallel guide
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.moveTo(0, 228); ctx.lineTo(W, 228); ctx.stroke();
      ctx.setLineDash([]);
      if (caption) {
        var txt = (window.BCDM_I18N && window.BCDM_I18N.t) ? window.BCDM_I18N.t(s.text) : s.text;
        caption.textContent = txt;
      }
      buttons.forEach(function (b) {
        var on = Number(b.getAttribute('data-park-step')) === n;
        b.classList.toggle('bg-blue-600', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('bg-slate-100', !on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        draw(Number(b.getAttribute('data-park-step')));
      });
    });
    draw(1);
  }

  /* ---------- Simulator: hill parking wheel direction ---------- */

  function initHill() {
    var radios = document.querySelectorAll('input[name="hill"]');
    var out = document.getElementById('hill-out');
    if (!radios.length || !out) return;

    var rules = {
      'up-curb':    { dir: '左', arrow: '←', text: '上坡有路緣：方向盤向左打到底（輪胎遠離路緣），車輛稍微溜後，讓後輪輕抵路緣作擋塊。' },
      'up-nocurb':  { dir: '右', arrow: '→', text: '上坡無路緣：方向盤向右打到底，若溜車，車輪會溜向路邊。' },
      'down':       { dir: '右', arrow: '→', text: '下坡（有或無路緣）：方向盤向右打到底，朝路邊方向。' }
    };

    function render() {
      var checked = document.querySelector('input[name="hill"]:checked');
      var r = rules[checked ? checked.value : 'up-curb'];
      out.innerHTML =
        '<div class="text-6xl font-black text-purple-600 leading-none">' + r.arrow + '</div>' +
        '<p class="mt-3 font-bold text-slate-900">方向盤打向：' + r.dir + ' 打到底</p>' +
        '<p class="mt-2 text-sm text-slate-600">' + r.text + '</p>' +
        '<p class="mt-3 text-xs text-rose-600 font-semibold">全部情況：入 P 檔，拉緊手煞車（Parking Brake）。</p>';
    }

    radios.forEach(function (r) { r.addEventListener('change', render); });
    render();
  }

  /* ---------- Hazard perception scene ---------- */

  function initHazard() {
    var spots = document.querySelectorAll('[data-hazard]');
    var score = document.getElementById('hazard-score');
    var feedback = document.getElementById('hazard-feedback');
    if (!spots.length) return;
    var total = spots.length;
    var found = {};

    spots.forEach(function (spot) {
      spot.addEventListener('click', function () {
        var id = spot.getAttribute('data-hazard');
        if (found[id]) return;
        found[id] = true;
        spot.classList.add('ring-4', 'ring-emerald-400', 'bg-emerald-400/30');
        spot.setAttribute('aria-pressed', 'true');
        var n = Object.keys(found).length;
        if (score) score.textContent = n + ' / ' + total;
        if (feedback) feedback.textContent = spot.getAttribute('data-note') || '已標記';
        if (n === total) {
          if (feedback) feedback.textContent = '全部標記完成！記得口頭說出：「I see a …, it could …, so I will …」';
          celebrate();
        }
      });
    });
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

    function evaluate() {
      var failCount = 0;
      fails.forEach(function (f) { if (f.checked) failCount++; });
      var points = 0;
      demerits.forEach(function (d) {
        var pts = Number(d.getAttribute('data-points')) || 0;
        points += pts * (Number(d.value) || 0);
      });
      var passed = failCount === 0 && points < PRACTICE_PASS_LIMIT;
      var t = (window.BCDM_I18N && window.BCDM_I18N.t) ? window.BCDM_I18N.t : function (x) { return x; };
      if (result) {
        result.textContent = failCount > 0 ? t('不及格（即時 Fail）') : (passed ? t('練習通過') : t('練習不及格（扣分過多）'));
        result.className = 'text-2xl font-black ' + (passed ? 'text-emerald-600' : 'text-rose-600');
      }
      if (detail) {
        var lang = (window.BCDM_I18N && window.BCDM_I18N.getLang) ? window.BCDM_I18N.getLang() : 'yue';
        if (lang === 'en') {
          detail.textContent = 'Auto-Fails: ' + failCount + ' | Demerits Total: ' + points + ' pts (Pass limit: < ' + PRACTICE_PASS_LIMIT + ' pts, practice reference)';
        } else if (lang === 'zh') {
          detail.textContent = '致命扣分位 ' + failCount + ' 项 ｜ 扣分合计 ' + points + ' 分（练习参考上限 ' + PRACTICE_PASS_LIMIT + ' 分，非 ICBC 官方数字）';
        } else {
          detail.textContent = '即死位 ' + failCount + ' 項　｜　扣分合計 ' + points + ' 分（練習參考上限 ' + PRACTICE_PASS_LIMIT + ' 分，非 ICBC 官方數字）';
        }
      }
      if (passed && failCount === 0 && points === 0) celebrate();
    }

    fails.forEach(function (f) { f.addEventListener('change', function () { save(); evaluate(); }); });
    demerits.forEach(function (d) { d.addEventListener('input', function () { save(); evaluate(); }); });
    if (reset) {
      reset.addEventListener('click', function () {
        fails.forEach(function (f) { f.checked = false; });
        demerits.forEach(function (d) { d.value = 0; });
        save();
        evaluate();
      });
    }
    evaluate();
  }

  /* ---------- Boot ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderFooter();
    if (window.BCDM_I18N && window.BCDM_I18N.initSwitcher) {
      window.BCDM_I18N.initSwitcher();
    }
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
