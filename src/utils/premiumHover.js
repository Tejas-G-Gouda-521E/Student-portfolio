const HOVER_ACCENT = "#cf4542";
const COLOR_MS = 300;
const SCRAMBLE_MS = 200;
const CHAR_POOL = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789#@!?<>";

const activeScrambles = new WeakMap();

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function wrapTextNodes(root) {
  if (root.querySelector(".hover-char")) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.classList.contains("hover-char")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((textNode) => {
    const text = textNode.textContent;
    const fragment = document.createDocumentFragment();

    for (const char of text) {
      const span = document.createElement("span");
      span.className = "hover-char";
      span.textContent = char === " " ? "\u00A0" : char;
      span.dataset.original = char === " " ? " " : char;
      fragment.appendChild(span);
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  });
}

function hasScrambleableText(el) {
  if (el.classList.contains("hover-interactive--icon")) return false;
  if (el.querySelector("svg") && !el.querySelector(".hover-char")) {
    const text = el.textContent?.trim() ?? "";
    return text.length >= 2;
  }
  return (el.textContent?.trim().length ?? 0) >= 2;
}

function runScramble(el) {
  if (prefersReducedMotion()) return;

  const chars = el.querySelectorAll(".hover-char");
  if (!chars.length) return;

  const existing = activeScrambles.get(el);
  if (existing) cancelAnimationFrame(existing.raf);

  const start = performance.now();
  let raf = 0;

  const tick = (now) => {
    const progress = (now - start) / SCRAMBLE_MS;

    if (progress < 1) {
      chars.forEach((span) => {
        if (Math.random() > 0.35) {
          span.textContent =
            span.dataset.original === " "
              ? "\u00A0"
              : CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
        }
        const jitter = (Math.random() - 0.5) * 2.2;
        span.style.transform = `translate3d(${jitter}px, 0, 0)`;
      });
      raf = requestAnimationFrame(tick);
      activeScrambles.set(el, { raf });
    } else {
      chars.forEach((span) => {
        const original = span.dataset.original ?? span.textContent;
        span.textContent = original === " " ? "\u00A0" : original;
        span.style.transform = "translate3d(0, 0, 0)";
      });
      activeScrambles.delete(el);
    }
  };

  raf = requestAnimationFrame(tick);
  activeScrambles.set(el, { raf });
}

function bindElement(el) {
  if (el.dataset.hoverBound === "true") {
    if (!el.querySelector(".hover-char") && hasScrambleableText(el)) {
      delete el.dataset.hoverBound;
    } else {
      return;
    }
  }
  el.dataset.hoverBound = "true";

  if (hasScrambleableText(el)) {
    wrapTextNodes(el);
  }

  const onEnter = () => {
    el.classList.add("is-hover-active");
    runScramble(el);
  };

  const onLeave = () => {
    el.classList.remove("is-hover-active");
    const existing = activeScrambles.get(el);
    if (existing) cancelAnimationFrame(existing.raf);
    activeScrambles.delete(el);

    el.querySelectorAll(".hover-char").forEach((span) => {
      const original = span.dataset.original ?? span.textContent;
      span.textContent = original === " " ? "\u00A0" : original;
      span.style.transform = "translate3d(0, 0, 0)";
    });
  };

  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);
  el.addEventListener("focus", onEnter);
  el.addEventListener("blur", onLeave);
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function initPremiumHover(root = document.body) {
  const scan = () => {
    root.querySelectorAll(".hover-interactive").forEach(bindElement);
  };

  scan();

  const observer = new MutationObserver(debounce(scan, 80));
  observer.observe(root, { childList: true, subtree: true });

  return () => observer.disconnect();
}

export { HOVER_ACCENT, COLOR_MS };
