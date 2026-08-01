/* 笔法 · 前端交互
 * 多页面共用：所有 DOM 查询均做空值保护，元素不存在时静默跳过，
 * 这样文章页（没有筛选/练习/统计元素）也不会报错。
 */
(function () {
  "use strict";

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ---- 移动端导航 ---- */
  var nav = $(".site-nav");
  var toggle = $("#navToggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#navLinks a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- Skills 筛选（仅首页存在） ---- */
  var tabs = $$(".ftab");
  if (tabs.length) {
    var cards = $$(".scard");
    var countEl = $("#skillCount");
    var emptyEl = $("#skillsEmpty");
    var grid = $("#skillGrid");
    var total = countEl ? parseInt(countEl.dataset.total, 10) || cards.length : cards.length;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        var f = tab.dataset.filter;
        var shown = 0;
        cards.forEach(function (c) {
          var hit = (f === "全部") || (c.dataset.cat && c.dataset.cat.split(" ").indexOf(f) > -1);
          c.style.display = hit ? "" : "none";
          if (hit) shown++;
        });
        if (countEl) countEl.textContent = "显示 " + shown + " / " + total + " 项技能";
        if (emptyEl) emptyEl.style.display = shown === 0 ? "block" : "none";
        if (grid) grid.style.display = shown === 0 ? "none" : "grid";
      });
    });
  }

  /* ---- FAQ 分类导航高亮（仅 FAQ 页存在） ---- */
  var faqNavLinks = $$(".faq-nav a");
  var faqGroups = $$(".faq-group");
  if (faqNavLinks.length && faqGroups.length) {
    var faqSpy = function () {
      var pos = window.scrollY + 120;
      var current = null;
      faqGroups.forEach(function (g) { if (g.offsetTop <= pos) current = g; });
      faqNavLinks.forEach(function (a) { a.classList.remove("active"); });
      if (current) {
        var id = current.id;
        faqNavLinks.forEach(function (a) {
          if ((a.getAttribute("href") || "").split("#")[1] === id) a.classList.add("active");
        });
      }
    };
    window.addEventListener("scroll", faqSpy, { passive: true });
    faqSpy();
    // 点击导航时阻止默认跳转，改用平滑滚动
    faqNavLinks.forEach(function (a) {
      a.addEventListener("click", function (e) {
        var hash = (a.getAttribute("href") || "").split("#")[1];
        var target = hash ? document.getElementById(hash) : null;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ---- 习作展示页筛选（仅展示页存在） ---- */
  var showcaseTabs = $$(".showcase-block .ftab");
  if (showcaseTabs.length) {
    var scCards = $$(".showcase-card");
    var scCountEl = $("#showcaseCount");
    var scEmptyEl = $("#showcaseEmpty");
    var scGrid = $("#showcaseGrid");
    var scTotal = scCountEl ? parseInt(scCountEl.dataset.total, 10) || scCards.length : scCards.length;
    showcaseTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        showcaseTabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        var f = tab.dataset.filter;
        var shown = 0;
        scCards.forEach(function (c) {
          var hit = (f === "全部") || (c.dataset.cat && c.dataset.cat.split(" ").indexOf(f) > -1);
          c.style.display = hit ? "" : "none";
          if (hit) shown++;
        });
        if (scCountEl) scCountEl.textContent = "显示 " + shown + " / " + scTotal + " 篇习作";
        if (scEmptyEl) scEmptyEl.style.display = shown === 0 ? "block" : "none";
        if (scGrid) scGrid.style.display = shown === 0 ? "none" : "grid";
      });
    });
  }

  /* ---- 写作练习：随机题库 + 字数统计 + 匿名提交（仅首页存在） ---- */
  var pracForm = $("#pracForm");
  if (pracForm) {
    // 题库从页面注入的 JSON 读取（数据源是 src/_data/prompts.json）
    var dataEl = $("#promptsData");
    var prompts = [];
    try { prompts = dataEl ? JSON.parse(dataEl.textContent) : []; } catch (e) { prompts = []; }

    var pCat = $("#promptCat");
    var pText = $("#promptText");
    var pHint = $("#promptHint");
    var pCard = $(".prompt-card");
    var lastIdx = -1;
    function rollPrompt() {
      if (!prompts.length) return;
      var i;
      do { i = Math.floor(Math.random() * prompts.length); } while (i === lastIdx && prompts.length > 1);
      lastIdx = i;
      if (pCat) pCat.textContent = prompts[i].cat;
      if (pText) pText.textContent = prompts[i].text;
      if (pHint) pHint.textContent = prompts[i].hint;
      if (pCard) {
        pCard.classList.remove("swap");
        void pCard.offsetWidth; // 强制重排以重启动画
        pCard.classList.add("swap");
      }
    }
    var rerollBtn = $("#rerollBtn");
    if (rerollBtn) rerollBtn.addEventListener("click", rollPrompt);
    rollPrompt();

    var pracOk = $("#pracOk");
    var pracText = $("#pracText");
    var charCount = $("#charCount");
    var pracError = $("#pracError");
    if (pracText) {
      pracText.addEventListener("input", function () {
        if (charCount) charCount.textContent = pracText.value.length + " 字";
        if (pracText.value.trim()) {
          if (pracError) pracError.style.display = "none";
          pracText.classList.remove("invalid");
        }
      });
    }
    pracForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!pracText || !pracText.value.trim()) {
        if (pracError) pracError.style.display = "block";
        if (pracText) { pracText.classList.add("invalid"); pracText.focus(); }
        return;
      }
      pracForm.style.display = "none";
      if (pracOk) pracOk.style.display = "block";
    });
    var againBtn = $("#againBtn");
    if (againBtn) {
      againBtn.addEventListener("click", function () {
        if (pracOk) pracOk.style.display = "none";
        pracForm.style.display = "flex";
        if (pracText) { pracText.value = ""; pracText.focus(); }
        if (charCount) charCount.textContent = "0 字";
        rollPrompt();
      });
    }
  }

  /* ---- 滚动显现 ---- */
  var reveals = $$(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- 导航滚动高亮（仅首页各板块存在时生效） ---- */
  var links = $$("#navLinks a");
  var sections = [];
  links.forEach(function (a) {
    var hash = (a.getAttribute("href") || "").split("#")[1];
    if (!hash) return;
    var sec = document.getElementById(hash);
    if (sec) sections.push({ a: a, sec: sec });
  });
  if (sections.length) {
    function spy() {
      var pos = window.scrollY + 120;
      var current = null;
      sections.forEach(function (s) { if (s.sec.offsetTop <= pos) current = s; });
      links.forEach(function (a) { a.classList.remove("current"); });
      if (current) current.a.classList.add("current");
    }
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  /* ---- 统计数字滚动计数（仅首页存在） ---- */
  var nums = $$(".stats .num");
  var noMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (nums.length && "IntersectionObserver" in window && !noMotion) {
    function countUp(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var dur = 900, t0 = null;
      function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); nio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { el.textContent = "0"; nio.observe(el); });
  }
})();
