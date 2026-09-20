/**
 * Renders the page from SITE_DATA (see data.js) and wires up the
 * three interactions the board supports:
 *   - drag a card's header to reorder cards
 *   - click a card's header to expand/collapse it
 *   - drag the bottom edge of an open card to resize it
 * All three states are remembered per-visitor via localStorage, so
 * a reload doesn't reset the layout.
 */
(function () {
  "use strict";

  const STORAGE_KEYS = {
    order: "portfolio.cardOrder",
    expanded: "portfolio.expandedCards",
    heights: "portfolio.cardHeights"
  };

  // ---- small storage helpers, all fail quietly if storage is unavailable ----
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* storage disabled or full — silently skip persistence */
    }
  }

  function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    const first = parts[0][0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  function hostnameOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (err) {
      return "";
    }
  }

  const ICONS = {
    chevron:
      '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    grip:
      '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="9" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="9.5" r="1" fill="currentColor"/><circle cx="9" cy="9.5" r="1" fill="currentColor"/></svg>',
    download:
      '<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1.5v8m0 0L4 6.7M7 9.5l3-2.8M2 11h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // ============================================================
  // Profile / hero
  // ============================================================
  function renderProfile(profile) {
    const hero = document.getElementById("hero");
    const photoHTML = profile.photo
      ? `<img class="hero__photo" src="${profile.photo}" alt="Photo of ${profile.name}">`
      : `<div class="hero__avatar" aria-hidden="true">${initials(profile.name)}</div>`;

    const contactsHTML = (profile.contacts || [])
      .map((c) => `<li><a href="${c.url}">${c.label}</a></li>`)
      .join("");

    const resumeHTML = profile.resumeUrl
      ? `<a class="btn-resume" href="${profile.resumeUrl}" target="_blank" rel="noopener">${ICONS.download} Résumé</a>`
      : "";

    hero.innerHTML = `
      ${photoHTML}
      <div class="hero__body">
        <h1 class="hero__name">${profile.name}</h1>
        <p class="hero__title">${profile.title}</p>
        <p class="hero__bio">${profile.bio}</p>
        <div class="hero__actions">
          ${resumeHTML}
          <ul class="contact-links">${contactsHTML}</ul>
        </div>
      </div>
    `;

    document.title = `${profile.name} — Portfolio`;
    const footer = document.getElementById("footer-text");
    if (footer) footer.textContent = `© ${new Date().getFullYear()} ${profile.name}`;
  }

  // ============================================================
  // Board / cards
  // ============================================================
  function orderedCategories(categories) {
    const savedOrder = readJSON(STORAGE_KEYS.order, null);
    if (!Array.isArray(savedOrder)) return categories.slice();

    const byId = new Map(categories.map((c) => [c.id, c]));
    const ordered = [];
    savedOrder.forEach((id) => {
      if (byId.has(id)) {
        ordered.push(byId.get(id));
        byId.delete(id);
      }
    });
    // Any category not in the saved order (e.g. newly added) goes at the end.
    byId.forEach((c) => ordered.push(c));
    return ordered;
  }

  function buildCard(category, expandedSet, heightsMap) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = category.id;
    card.style.setProperty("--accent", category.accent || "");
    if (expandedSet.has(category.id)) card.classList.add("expanded");

    const count = (category.items || []).length;
    const countLabel = count === 1 ? "1 project" : `${count} projects`;

    const itemsHTML = count
      ? `<ul class="item-list">${category.items
          .map(
            (item) => `
          <li>
            <a href="${item.url}" target="_blank" rel="noopener">
              <span class="item__title">${item.title}</span>
              ${item.description ? `<p class="item__description">${item.description}</p>` : ""}
              <span class="item__domain">${hostnameOf(item.url)}</span>
            </a>
          </li>`
          )
          .join("")}</ul>`
      : `<p class="card__empty">Nothing here yet.</p>`;

    card.innerHTML = `
      <div class="card__tab"></div>
      <button type="button" class="card__header" draggable="true" aria-expanded="${expandedSet.has(category.id)}">
        <span class="card__grip">${ICONS.grip}</span>
        <span class="card__heading">
          <span class="card__title">${category.title}</span>
          <p class="card__meta">${countLabel}</p>
          ${category.description ? `<p class="card__description">${category.description}</p>` : ""}
        </span>
        <span class="card__chevron">${ICONS.chevron}</span>
      </button>
      <div class="card__body-wrapper">
        <div class="card__body-outer">
          <div class="card__body">${itemsHTML}</div>
        </div>
      </div>
    `;

    const body = card.querySelector(".card__body");
    const savedHeight = heightsMap[category.id];
    if (savedHeight) body.style.height = savedHeight + "px";

    return card;
  }

  function saveOrderFromDOM(board) {
    const ids = Array.from(board.children).map((el) => el.dataset.id);
    writeJSON(STORAGE_KEYS.order, ids);
  }

  function wireExpandToggle(board, expandedSet) {
    board.addEventListener("click", (event) => {
      const header = event.target.closest(".card__header");
      if (!header) return;
      const card = header.closest(".card");
      const id = card.dataset.id;
      const isExpanded = card.classList.toggle("expanded");
      header.setAttribute("aria-expanded", String(isExpanded));
      if (isExpanded) expandedSet.add(id);
      else expandedSet.delete(id);
      writeJSON(STORAGE_KEYS.expanded, Array.from(expandedSet));
    });
  }

  function wireDragReorder(board) {
    let draggingCard = null;

    board.addEventListener("dragstart", (event) => {
      const header = event.target.closest(".card__header");
      if (!header) return;
      draggingCard = header.closest(".card");
      draggingCard.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      // Firefox requires data to be set for drag to start.
      event.dataTransfer.setData("text/plain", draggingCard.dataset.id);
    });

    board.addEventListener("dragend", () => {
      if (draggingCard) draggingCard.classList.remove("dragging");
      board.querySelectorAll(".card.drag-over").forEach((el) => el.classList.remove("drag-over"));
      draggingCard = null;
    });

    board.addEventListener("dragover", (event) => {
      if (!draggingCard) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const targetCard = event.target.closest(".card");
      board.querySelectorAll(".card.drag-over").forEach((el) => el.classList.remove("drag-over"));
      if (targetCard && targetCard !== draggingCard) targetCard.classList.add("drag-over");
    });

    board.addEventListener("drop", (event) => {
      if (!draggingCard) return;
      event.preventDefault();
      const targetCard = event.target.closest(".card");
      if (targetCard && targetCard !== draggingCard) {
        const rect = targetCard.getBoundingClientRect();
        const insertAfter = event.clientY > rect.top + rect.height / 2;
        targetCard.insertAdjacentElement(insertAfter ? "afterend" : "beforebegin", draggingCard);
      }
      board.querySelectorAll(".card.drag-over").forEach((el) => el.classList.remove("drag-over"));
      saveOrderFromDOM(board);
    });
  }

  function wireResizePersistence(board, heightsMap) {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const body = entry.target;
        const card = body.closest(".card");
        if (!card || !card.classList.contains("expanded")) return;
        heightsMap[card.dataset.id] = Math.round(entry.contentRect.height);
        writeJSON(STORAGE_KEYS.heights, heightsMap);
      });
    });
    board.querySelectorAll(".card__body").forEach((body) => observer.observe(body));
  }

  function renderBoard(categories) {
    const board = document.getElementById("board");
    const expandedSet = new Set(readJSON(STORAGE_KEYS.expanded, []));
    const heightsMap = readJSON(STORAGE_KEYS.heights, {});

    board.innerHTML = "";
    orderedCategories(categories).forEach((category) => {
      board.appendChild(buildCard(category, expandedSet, heightsMap));
    });

    wireExpandToggle(board, expandedSet);
    wireDragReorder(board);
    wireResizePersistence(board, heightsMap);
  }

  // ============================================================
  // Boot
  // ============================================================
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof SITE_DATA === "undefined") return;
    renderProfile(SITE_DATA.profile || {});
    renderBoard(SITE_DATA.categories || []);
  });
})();
