const menuToggle = document.querySelector(".menu-toggle");
const sideMenu = document.querySelector("#sideMenu");
const menuBackdrop = document.querySelector(".menu-backdrop");
const menuCloseTargets = document.querySelectorAll("[data-menu-close]");
const articleSearchForm = document.querySelector("[data-article-search-form]");
const articleSearchInput = document.querySelector("[data-article-search]");
const articleList = document.querySelector("[data-article-list]");
const articleEmpty = document.querySelector("[data-article-empty]");
const communitySearchForm = document.querySelector("[data-community-search-form]");
const communitySearchInput = document.querySelector("[data-community-search]");
const communityGrid = document.querySelector("[data-community-grid]");
const communitySortControls = document.querySelectorAll("[data-community-sort]");

const setMenuOpen = (isOpen) => {
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  sideMenu.hidden = !isOpen;
  menuBackdrop.hidden = !isOpen;

  requestAnimationFrame(() => {
    sideMenu.classList.toggle("is-open", isOpen);
  });
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

menuCloseTargets.forEach((target) => {
  target.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

if (articleSearchInput && articleList) {
  const articleCards = Array.from(articleList.querySelectorAll(".article-card"));

  const filterArticles = () => {
    const query = articleSearchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    articleCards.forEach((card) => {
      const isVisible = !query || card.textContent.toLowerCase().includes(query);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (articleEmpty) {
      articleEmpty.hidden = visibleCount !== 0;
    }
  };

  articleSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    filterArticles();
  });

  articleSearchInput.addEventListener("input", filterArticles);
}

if (communityGrid) {
  const feedItems = Array.from(communityGrid.querySelectorAll(".feed-card")).map((card, index) => {
    const likesText = card.querySelector(".feed-likes span:last-child")?.textContent || "0";
    const likes = Number(likesText.replace(/[^\d]/g, ""));

    return { card, index, likes };
  });

  const applyCommunitySort = (sortMode) => {
    const sortedItems = [...feedItems].sort((a, b) => {
      if (sortMode === "popular") return b.likes - a.likes || a.index - b.index;
      return a.index - b.index;
    });

    sortedItems.forEach(({ card }) => communityGrid.appendChild(card));
  };

  const filterCommunity = () => {
    const query = communitySearchInput?.value.trim().toLowerCase() || "";

    feedItems.forEach(({ card }) => {
      card.hidden = Boolean(query) && !card.textContent.toLowerCase().includes(query);
    });
  };

  communitySearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    filterCommunity();
  });

  communitySearchInput?.addEventListener("input", filterCommunity);

  communitySortControls.forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();

      communitySortControls.forEach((item) => item.classList.toggle("active", item === control));
      applyCommunitySort(control.dataset.communitySort);
      filterCommunity();
    });
  });
}
