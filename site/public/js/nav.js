(() => {
  const header = document.querySelector("[data-gt-header]");
  const toggle = document.querySelector("[data-gt-nav-toggle]");
  if (!header || !toggle) return;
  header.classList.add("gt-header--js");
  toggle.hidden = false;
  const setOpen = (open) => {
    header.classList.toggle("gt-header--open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
})();
