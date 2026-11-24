/* Translates marked text and attributes in place so controls keep their state. */
(function () {
  'use strict';

  var storageKey = 'bcdm.lang';
  var languages = [
    { code: 'yue', name: '廣東話', tag: 'yue-Hant-HK' },
    { code: 'en', name: 'English', tag: 'en' },
    { code: 'zh', name: '简体中文', tag: 'zh-CN' }
  ];
  var language = readLanguage();

  function readLanguage() {
    try {
      var saved = localStorage.getItem(storageKey);
      return languages.find(function (item) { return item.code === saved; }) || languages[0];
    } catch (error) {
      return languages[0];
    }
  }

  function t(key, values, original) {
    var parts = key.split('.');
    var message = window.BCDM_MESSAGES[parts[0]]?.[parts[1]];
    var text = message?.[language.code] ?? original ?? key;
    return values ? text.replace(/\{(\w+)\}/g, function (_, name) { return values[name]; }) : text;
  }

  function createDropdownMarkup() {
    var options = languages.map(function (item) {
      return '<button type="button" data-switch-lang="' + item.code + '" lang="' + item.tag + '"' +
        ' class="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center justify-between text-xs text-slate-700 transition">' +
        '<span>' + item.name + '</span><span aria-hidden="true" class="text-blue-600 font-bold" data-lang-check>✓</span></button>';
    }).join('');

    return '<details class="relative inline-block text-left shrink-0" id="lang-details">' +
      '<summary class="list-none cursor-pointer flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold whitespace-nowrap transition select-none" aria-labelledby="language-label language-name">' +
        '<i data-lucide="globe" class="w-4 h-4 text-blue-600" aria-hidden="true"></i>' +
        '<span class="sr-only" id="language-label" data-i18n="shared.language">切換語言</span>' +
        '<span id="language-name"></span>' +
        '<i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400" aria-hidden="true"></i>' +
      '</summary>' +
      '<div class="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5">' +
        options +
      '</div>' +
    '</details>';
  }

  function initSwitcher() {
    var attributes = ['alt', 'aria-label', 'placeholder', 'title'];
    var selector = ['[data-i18n]'].concat(attributes.map(function (attribute) {
      return '[data-i18n-' + attribute + ']';
    })).join(', ');
    var messages = [];
    document.querySelectorAll(selector).forEach(function (element) {
      if (element.hasAttribute('data-i18n')) {
        messages.push({ element: element, key: element.dataset.i18n, original: element.textContent });
      }
      attributes.forEach(function (attribute) {
        var key = element.getAttribute('data-i18n-' + attribute);
        if (key) messages.push({ element: element, attribute: attribute, key: key, original: element.getAttribute(attribute) });
      });
    });

    var picker = document.getElementById('lang-details');
    var name = document.getElementById('language-name');
    var buttons = picker.querySelectorAll('[data-switch-lang]');

    function render() {
      document.documentElement.lang = language.tag;
      messages.forEach(function (message) {
        var value = t(message.key, undefined, message.original);
        if (message.attribute) {
          message.element.setAttribute(message.attribute, value);
        } else {
          message.element.textContent = value;
        }
      });
      name.textContent = language.name;
      buttons.forEach(function (button) {
        var active = button.dataset.switchLang === language.code;
        button.setAttribute('aria-pressed', String(active));
        button.querySelector('[data-lang-check]').classList.toggle('invisible', !active);
      });
    }

    function updateLanguage(next) {
      if (next === language) return;
      language = next;
      render();
      window.dispatchEvent(new Event('bcdm:langchange'));
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var next = languages.find(function (item) { return item.code === button.dataset.switchLang; });
        try { localStorage.setItem(storageKey, next.code); } catch (error) { /* Keep the selection for this page. */ }
        updateLanguage(next);
        picker.open = false;
        picker.querySelector('summary').focus();
      });
    });

    document.addEventListener('click', function (event) {
      if (!picker.contains(event.target)) picker.open = false;
    });
    picker.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && picker.open) {
        picker.open = false;
        picker.querySelector('summary').focus();
      }
    });
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) updateLanguage(readLanguage());
    });
    window.addEventListener('storage', function (event) {
      if (event.key === storageKey || event.key === null) updateLanguage(readLanguage());
    });
    render();
  }

  window.BCDM_I18N = {
    t: t,
    createDropdownMarkup: createDropdownMarkup,
    initSwitcher: initSwitcher
  };
})();
