(() => {
  "use strict";

  function getPanelFromButton(btn) {
    // aria-controls가 있으면 그 id로 패널 찾기 (가장 안전)
    const id = btn.getAttribute("aria-controls");
    if (id) {
      const byId = document.getElementById(id);
      if (byId) return byId;
    }
    // 혹시 aria-controls가 깨졌을 때 대비: 같은 acc-item 내부의 panel 찾기
    const item = btn.closest(".acc-item");
    if (!item) return null;
    return item.querySelector(".acc-panel");
  }

  function closeItem(item) {
    const btn = item.querySelector(".acc-btn");
    const panel = item.querySelector(".acc-panel");
    if (!btn || !panel) return;

    btn.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = "0px";
    item.classList.remove("is-open");
  }

  function openItem(item) {
    const btn = item.querySelector(".acc-btn");
    const panel = item.querySelector(".acc-panel");
    if (!btn || !panel) return;

    btn.setAttribute("aria-expanded", "true");
    // scrollHeight는 내부 콘텐츠 높이
    panel.style.maxHeight = panel.scrollHeight + "px";
    item.classList.add("is-open");
  }

  function initAccordions() {
    // data-accordion가 없는 구조에서도 작동하게: .accordion 자체로 잡음
    const groups = document.querySelectorAll(".accordion");
    groups.forEach((group) => {
      const items = Array.from(group.querySelectorAll(".acc-item"));
      if (!items.length) return;

      // 초기화: aria-expanded가 true인 항목은 열어줌
      items.forEach((item) => {
        const btn = item.querySelector(".acc-btn");
        const panel = item.querySelector(".acc-panel");
        if (!btn || !panel) return;

        const isOpen = btn.getAttribute("aria-expanded") === "true";
        if (isOpen) openItem(item);
        else closeItem(item);
      });

      group.addEventListener("click", (e) => {
        const btn = e.target.closest(".acc-btn");
        if (!btn || !group.contains(btn)) return;

        const item = btn.closest(".acc-item");
        if (!item) return;

        // 패널 찾기 (안전)
        const panel = getPanelFromButton(btn);
        if (!panel) return;

        const isOpen = btn.getAttribute("aria-expanded") === "true";

        // 한 그룹에서 하나만 열리게
        items.forEach((it) => {
          if (it !== item) closeItem(it);
        });

        if (isOpen) closeItem(item);
        else {
          openItem(item);

          // 열릴 때 답이 화면에 들어오도록 약간 보정 (헤더 sticky 고려)
          const rect = btn.getBoundingClientRect();
          const top = window.scrollY + rect.top - 90;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });

    // 리사이즈 시 열린 패널 높이 재계산
    window.addEventListener("resize", () => {
      document.querySelectorAll(".acc-item.is-open").forEach((item) => {
        const panel = item.querySelector(".acc-panel");
        if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAccordions);
  } else {
    initAccordions();
  }
})();
