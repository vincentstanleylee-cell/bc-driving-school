/* Road sign collection, flashcards and a picture/meaning quiz. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var signs = window.BCDM_SIGNS;
    var t = window.BCDM_I18N.t;
    var storageKey = 'bcdm.signs';
    var source = 'https://www.icbc.com/assets/en/7CsgGUXEIxCwW8xQrqyoLu/drivers3.pdf';
    var categories = ['all', 'regulatory', 'crossings', 'lanes', 'parking', 'warnings', 'works', 'guide', 'rail', 'signals', 'markings'];
    var mode = 'explore';
    var category = 'all';
    var search = '';
    var opened = new Set();
    var progress = readProgress();
    var known = new Set(progress.known);
    var best = progress.best;
    var deck = signs.slice();
    var cardIndex = 0;
    var revealed = false;
    var round = null;
    var grid = document.getElementById('sign-grid');
    var categorySelect = document.getElementById('sign-category');
    var roundHost = document.getElementById('sign-quiz-round');
    var resultsHost = document.getElementById('sign-quiz-results');

    // Exclude equivalent actions as distractors, even if the pictures differ.
    var related = [
      ['lane-left', 'turn-left-only'], ['lane-straight', 'straight-only'],
      ['no-stopping', 'timed-no-stopping'], ['no-parking', 'timed-no-parking'],
      ['school-30', 'school-30-hours'], ['pullouts-next', 'traffic-delayed', 'five-delayed']
    ];

    function readProgress() {
      try {
        var saved = JSON.parse(localStorage.getItem(storageKey)) || {};
        var ids = Array.isArray(saved.known) ? saved.known : [];
        var result = saved.best;
        var validBest = result && Number.isInteger(result.total) && result.total > 0 &&
          Number.isInteger(result.score) && result.score >= 0 && result.score <= result.total;
        return { known: ids.filter(function (id) { return signs.some(function (sign) { return sign.id === id; }); }), best: validBest ? result : null };
      } catch (error) {
        return { known: [], best: null };
      }
    }

    function saveProgress() {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ known: Array.from(known), best: best }));
      } catch (error) { /* The lesson remains usable with browser storage disabled. */ }
    }

    function local(text) {
      var lang = document.documentElement.lang;
      return text[lang === 'en' ? 'en' : (lang === 'zh-CN' ? 'zh' : 'yue')];
    }

    function escapeText(text) {
      return String(text).replace(/[&<>"']/g, function (character) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
      });
    }

    function message(key, values) {
      return escapeText(t('signs.' + key, values));
    }

    function shuffled(items) {
      var copy = items.slice();
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temporary = copy[i];
        copy[i] = copy[j];
        copy[j] = temporary;
      }
      return copy;
    }

    function categorySigns() {
      return signs.filter(function (sign) { return category === 'all' || sign.category === category; });
    }

    function sourceLink(sign) {
      return '<a class="sign-source-link" href="' + source + '#page=' + sign.page +
        '" target="_blank" rel="noopener">' + message('sourcePage', { page: sign.page + 28 }) + '</a>';
    }

    function knownButton(sign) {
      var learned = known.has(sign.id);
      return '<button type="button" class="sign-known" data-known="' + sign.id +
        '" aria-pressed="' + learned + '">' + message(learned ? 'markedKnown' : 'markKnown') + '</button>';
    }

    function updateProgress() {
      document.getElementById('sign-learned-count').textContent = t('signs.learnedCount', { known: known.size, total: signs.length });
      document.getElementById('sign-learned-bar').style.width = (known.size / signs.length * 100) + '%';
      document.querySelectorAll('[data-known]').forEach(function (button) {
        var learned = known.has(button.dataset.known);
        button.textContent = t('signs.' + (learned ? 'markedKnown' : 'markKnown'));
        button.setAttribute('aria-pressed', String(learned));
      });
    }

    function renderExplorer() {
      var query = search.trim().toLocaleLowerCase();
      var visible = categorySigns().filter(function (sign) {
        var words = Object.values(sign.title).concat(Object.values(sign.detail)).join(' ').toLocaleLowerCase();
        return words.includes(query);
      });
      document.getElementById('sign-filter-count').textContent = t('signs.filterCount', { count: visible.length });
      document.getElementById('sign-empty').hidden = visible.length > 0;
      grid.innerHTML = visible.map(function (sign) {
        return '<details class="sign-card" data-sign="' + sign.id + '"' + (opened.has(sign.id) ? ' open' : '') + '>' +
          '<summary><img src="' + sign.image + '" alt="" loading="lazy" width="180" height="112">' +
          '<h4>' + escapeText(local(sign.title)) + '</h4></summary>' +
          '<div class="sign-card-body"><p>' + escapeText(local(sign.detail)) + '</p>' +
          knownButton(sign) + sourceLink(sign) + '</div></details>';
      }).join('');
    }

    function resetDeck() {
      deck = categorySigns();
      cardIndex = 0;
      revealed = false;
    }

    function renderCard() {
      var sign = deck[cardIndex];
      document.getElementById('sign-flashcard').innerHTML =
        '<div class="flash-face">' +
          '<img src="' + sign.image + '" alt="' + (revealed ? escapeText(local(sign.title)) : message('flashAlt')) + '" width="290" height="190">' +
          (revealed ? '<h5>' + escapeText(local(sign.title)) + '</h5><p>' + escapeText(local(sign.detail)) +
            '</p>' + knownButton(sign) + sourceLink(sign) : '<p>' + message('cardPrompt') + '</p>') +
        '</div>' +
        '<div class="flash-controls">' +
          '<button type="button" class="sign-secondary" data-card-move="-1">' + message('previous') + '</button>' +
          '<button type="button" class="sign-primary" id="sign-flip" aria-expanded="' + revealed + '">' +
            message(revealed ? 'hideAnswer' : 'reveal') + '</button>' +
          '<button type="button" class="sign-secondary" data-card-move="1">' + message('nextCard') + '</button>' +
        '</div><p class="flash-position" aria-live="polite">' + message('position', { current: cardIndex + 1, total: deck.length }) + '</p>';
    }

    function renderBest() {
      document.getElementById('sign-best').textContent = best
        ? t('signs.best', best) : t('signs.noBest');
    }

    function renderMode() {
      document.querySelectorAll('[data-mode]').forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
      });
      ['explore', 'study', 'quiz'].forEach(function (name) {
        document.getElementById('sign-' + name).hidden = name !== mode;
      });
      document.getElementById('sign-search-field').hidden = mode !== 'explore';
      document.getElementById('sign-filter-count').textContent = t('signs.filterCount', { count: categorySigns().length });
      updateProgress();
      if (mode === 'explore') renderExplorer();
      if (mode === 'study') renderCard();
      if (mode === 'quiz') renderQuiz();
    }

    function startRound(items) {
      var questions = shuffled(items).map(function (sign, index) {
        var equivalent = related.find(function (group) { return group.includes(sign.id); }) || [sign.id];
        var candidates = signs.filter(function (other) {
          return other.category === sign.category && !equivalent.includes(other.id);
        });
        return { sign: sign, type: index % 2 === 0 ? 'meaning' : 'picture',
          options: shuffled([sign].concat(shuffled(candidates).slice(0, 3))), selected: null };
      });
      round = { questions: questions, cursor: 0, score: 0, streak: 0, longest: 0, finished: false, category: category };
      mode = 'quiz';
      renderMode();
      document.getElementById('sign-activity').scrollIntoView({ block: 'start' });
      roundHost.querySelector('h4').focus();
    }

    function renderQuiz() {
      var active = round && !round.finished;
      document.getElementById('sign-quiz-setup').hidden = !!round;
      roundHost.hidden = !active;
      resultsHost.hidden = !round || active;
      renderBest();
      if (!round) return;
      if (round.finished) {
        renderResults();
        return;
      }
      var question = round.questions[round.cursor];
      var answered = question.selected !== null;
      var picture = question.type === 'picture';
      var right = question.selected === question.sign.id;
      roundHost.innerHTML =
        '<div class="quiz-status">' +
          '<span>' + message('questionCount', { current: round.cursor + 1, total: round.questions.length }) + '</span>' +
          '<span>' + message(round.category) + '</span>' +
          '<span>' + message('score', { score: round.score }) + '</span>' +
          '<span class="quiz-streak">' + message('streak', { streak: round.streak }) + '</span>' +
        '</div>' +
        '<div class="sign-meter"><div style="width:' + ((round.cursor + (answered ? 1 : 0)) / round.questions.length * 100) + '%"></div></div>' +
        (category !== round.category ? '<p class="sign-section-help">' + message('activeRound') + '</p>' : '') +
        '<div class="quiz-question"><h4 tabindex="-1">' + message(picture ? 'questionPicture' : 'questionMeaning') + '</h4>' +
          (picture ? '<p class="quiz-prompt-title">' + escapeText(local(question.sign.title)) + '</p>'
            : '<img src="' + question.sign.image + '" alt="' + message('questionAlt') + '" width="300" height="190">') +
        '</div>' +
        '<div class="quiz-options' + (picture ? ' quiz-options-images' : '') + '">' +
          question.options.map(function (option, index) {
            var correct = option.id === question.sign.id;
            var chosen = option.id === question.selected;
            var state = answered && correct ? ' is-correct' : (chosen ? ' is-wrong' : '');
            var mark = answered && correct ? '✓' : (chosen ? '×' : String(index + 1));
            return '<button type="button" class="quiz-option' + state + (picture ? ' quiz-option-image' : '') +
              '" data-answer="' + option.id + '"' + (answered ? ' disabled' : '') + '>' +
              '<span class="quiz-option-mark" aria-hidden="true">' + mark + '</span>' +
              (picture ? '<img src="' + option.image + '" alt="' + message('optionAlt', { number: index + 1 }) + '" width="180" height="120">'
                : '<span>' + escapeText(local(option.title)) + '</span>') + '</button>';
          }).join('') +
        '</div>' +
        (answered ? '<div class="quiz-feedback" tabindex="-1" role="status">' +
          '<h5>' + message(right ? 'correct' : 'incorrect') + '</h5>' +
          '<p><strong>' + message('correctAnswer', { answer: local(question.sign.title) }) + '</strong></p>' +
          '<p>' + escapeText(local(question.sign.detail)) + '</p>' + sourceLink(question.sign) +
          '<button type="button" class="sign-primary" id="sign-next-question">' +
            message(round.cursor + 1 === round.questions.length ? 'showResults' : 'nextQuestion') + '</button></div>' : '');
    }

    function answer(id) {
      var question = round.questions[round.cursor];
      if (question.selected !== null || !question.options.some(function (option) { return option.id === id; })) return;
      question.selected = id;
      if (id === question.sign.id) {
        round.score++;
        round.streak++;
        round.longest = Math.max(round.longest, round.streak);
      } else {
        round.streak = 0;
      }
      renderQuiz();
      roundHost.querySelector('.quiz-feedback').focus();
    }

    function missedSigns() {
      return round.questions.filter(function (question) { return question.selected !== question.sign.id; })
        .map(function (question) { return question.sign; });
    }

    function finishRound() {
      round.finished = true;
      var total = round.questions.length;
      if (!best || round.score / total > best.score / best.total ||
          (round.score / total === best.score / best.total && total > best.total)) {
        best = { score: round.score, total: total };
        saveProgress();
      }
      renderQuiz();
      resultsHost.querySelector('h4').focus();
      if (round.score === total && window.confetti && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.65 } });
      }
    }

    function renderResults() {
      var missed = missedSigns();
      var total = round.questions.length;
      var title = round.score === total ? 'perfectTitle' : (round.score / total >= 0.75 ? 'greatTitle' : 'keepTitle');
      resultsHost.innerHTML =
        '<div class="quiz-results"><h4 tabindex="-1">' + message(title) + '</h4>' +
          '<div class="quiz-score">' + round.score + ' / ' + total + '</div>' +
          '<p>' + message('resultDetail', { score: round.score, total: total, streak: round.longest }) + '</p>' +
          '<div class="quiz-results-actions">' +
            (missed.length ? '<button type="button" class="sign-primary" id="sign-retry">' + message('retryMissed') + '</button>' : '') +
            '<button type="button" class="sign-secondary" id="sign-new-round">' + message('newRound') + '</button>' +
          '</div>' +
          (missed.length ? '<div class="quiz-review"><h5>' + message('reviewHeading') + '</h5>' +
            missed.map(function (sign) {
              return '<article><img src="' + sign.image + '" alt="" width="75" height="85">' +
                '<div><h6>' + escapeText(local(sign.title)) + '</h6><p>' + escapeText(local(sign.detail)) + '</p>' +
                sourceLink(sign) + '</div></article>';
            }).join('') + '</div>' : '<p>' + message('practicePerfect') + '</p>') +
        '</div>';
    }

    function renderCategories() {
      categorySelect.innerHTML = categories.map(function (name) {
        var total = name === 'all' ? signs.length : signs.filter(function (sign) { return sign.category === name; }).length;
        return '<option value="' + name + '">' + message(name) + ' (' + total + ')</option>';
      }).join('');
      categorySelect.value = category;
    }

    document.querySelectorAll('[data-mode]').forEach(function (button) {
      button.addEventListener('click', function () {
        mode = button.dataset.mode;
        renderMode();
      });
    });
    categorySelect.addEventListener('change', function () {
      category = categorySelect.value;
      resetDeck();
      renderMode();
    });
    document.getElementById('sign-search').addEventListener('input', function (event) {
      search = event.target.value;
      renderExplorer();
    });
    grid.addEventListener('toggle', function (event) {
      var card = event.target;
      if (card.dataset.sign) {
        if (card.open) opened.add(card.dataset.sign);
        else opened.delete(card.dataset.sign);
      }
    }, true);
    document.getElementById('sign-shuffle').addEventListener('click', function () {
      deck = shuffled(deck);
      cardIndex = 0;
      revealed = false;
      renderCard();
    });
    document.getElementById('sign-start-quick').addEventListener('click', function () {
      startRound(shuffled(categorySigns()).slice(0, 12));
    });
    document.getElementById('sign-start-all').addEventListener('click', function () {
      startRound(categorySigns());
    });
    document.getElementById('hero-quiz').addEventListener('click', function (event) {
      event.preventDefault();
      startRound(shuffled(categorySigns()).slice(0, 12));
    });
    document.getElementById('sign-activity').addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button || button.disabled) return;
      if (button.dataset.known) {
        var id = button.dataset.known;
        if (known.has(id)) known.delete(id);
        else known.add(id);
        saveProgress();
        updateProgress();
      } else if (button.dataset.cardMove) {
        cardIndex = (cardIndex + Number(button.dataset.cardMove) + deck.length) % deck.length;
        revealed = false;
        renderCard();
        document.querySelector('[data-card-move="' + button.dataset.cardMove + '"]').focus();
      } else if (button.id === 'sign-flip') {
        revealed = !revealed;
        renderCard();
        document.getElementById('sign-flip').focus();
      } else if (button.dataset.answer && round && !round.finished) {
        answer(button.dataset.answer);
      } else if (button.id === 'sign-next-question') {
        if (round.cursor + 1 === round.questions.length) {
          finishRound();
        } else {
          round.cursor++;
          renderQuiz();
          roundHost.querySelector('h4').focus();
        }
      } else if (button.id === 'sign-retry') {
        startRound(missedSigns());
      } else if (button.id === 'sign-new-round') {
        round = null;
        renderQuiz();
        document.getElementById('sign-start-quick').focus();
      }
    });
    window.addEventListener('bcdm:langchange', function () {
      renderCategories();
      renderMode();
    });

    renderCategories();
    renderMode();
  });
})();
